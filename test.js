const backendUrl = 'https://3c2c303238a0.ngrok-free.app/api/messages';
    function getSelectedChannelId() {
      return document.getElementById('channelSelector').value;
    }
    async function fetchMessages() {
  const channelId = getSelectedChannelId();
  try {
    const res = await fetch(`${backendUrl}?channelId=${channelId}`);
    const data = await res.json();
    const list = document.getElementById('messages');
    list.innerHTML = '';
    for (const msg of data.reverse()) {
      const li = document.createElement('li');
      const displayName = msg.member?.nick || msg.author.username;
      const avatarUrl = msg.author.avatar
        ? `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/0.png`;
      const timestamp = new Date(msg.timestamp).toLocaleString();
      let contentWithMentions = msg.content || '';
      if (msg.mentions && msg.mentions.length > 0) {
        msg.mentions.forEach(u => {
          const name = u.nick || u.username;
          contentWithMentions = contentWithMentions.replace(new RegExp(`<@!?${u.id}>`, 'g'), `@${name}`);
        });
      }
      const imageRegex = /(https?:\/\/[^\s]+\.(png|jpg|jpeg|gif|webp))/gi;
      let imagesHTML = '';
      let match;
      while ((match = imageRegex.exec(contentWithMentions)) !== null) {
        imagesHTML += `<br><img class="message-img" src="${match[1]}" style="max-width:300px;">`;
      }
      let embedText = '';
      if (msg.embeds && msg.embeds.length > 0) {
        msg.embeds.forEach(embed => {
          if (embed.title) embedText += `\nTitle: ${embed.title}`;
          if (embed.description) embedText += `\n${embed.description}`;
          if (embed.fields && embed.fields.length > 0) {
            embed.fields.forEach(f => {
              embedText += `\n${f.name}: ${f.value}`;
            });
          }
        });
        if (embedText) embedText = `<br><div style="font-style:italic;color:#555;">${embedText}</div>`;
      }
      let attachmentsHTML = '';
      if (msg.attachments && msg.attachments.length > 0) {
        msg.attachments.forEach(att => {
          const url = att.url;
          const name = att.filename;
          const lowerName = name.toLowerCase();
          if (/\.(png|jpg|jpeg|gif|webp)$/.test(lowerName)) {
            attachmentsHTML += `<br><img class="message-img" src="${url}" alt="${name}" style="max-width:300px;">`;
          } else if (/\.(mp4|webm|mov)$/.test(lowerName)) {
            attachmentsHTML += `<br><video controls style="max-width:300px;"><source src="${url}" type="video/${lowerName.split('.').pop()}"></video>`;
          } else if (/\.(mp3|wav|ogg)$/.test(lowerName)) {
            attachmentsHTML += `<br><audio controls><source src="${url}" type="audio/${lowerName.split('.').pop()}"></audio>`;
          } else {
            attachmentsHTML += `<br><a href="${url}" download>${name}</a>`;
          }
        });
      }
      let reactionsHTML = '';
      if (msg.reactions && msg.reactions.length > 0) {
        msg.reactions.forEach(r => {
          const emoji = r.emoji.id
            ? `<img src="https://cdn.discordapp.com/emojis/${r.emoji.id}.${r.emoji.animated ? 'gif' : 'png'}" style="width:16px;height:16px;">`
            : r.emoji.name;
          reactionsHTML += `<span style="margin-right:5px;">${emoji} x${r.count}</span>`;
        });
        if (reactionsHTML) reactionsHTML = `<div style="margin-top:5px;">${reactionsHTML}</div>`;
      }
      let replyHTML = '';
      if (msg.reference) {
        try {
          const refRes = await fetch(`${backendUrl}?channelId=${msg.reference.channel_id}&messageId=${msg.reference.message_id}`);
          const refMsg = await refRes.json();
          const refName = refMsg.member?.nick || refMsg.author.username;
          replyHTML = `<div style="font-style:italic;color:#666;">Replying to ${refName}: ${refMsg.content}</div>`;
        } catch {
          replyHTML = `<div style="font-style:italic;color:#666;">Replying to a deleted message</div>`;
        }
      }
      li.innerHTML = `
        <img src="${avatarUrl}" class="avatar" style="width:40px;height:40px;border-radius:50%;vertical-align:middle;">
        <div class="content" style="display:inline-block;vertical-align:middle;margin-left:10px;">
          <strong>${displayName}</strong>
          ${replyHTML}
          <div>${contentWithMentions}${imagesHTML}${embedText}</div>
          ${attachmentsHTML}
          ${reactionsHTML}
          <div class="timestamp" style="font-size:0.8em;color:#888;">${timestamp}</div>
        </div>
      `;
      list.prepend(li);
    }
  } catch (err) {
    console.error('Error fetching messages:', err);
  }
}
    async function sendMessage(name, content) {
      const channelId = getSelectedChannelId();
      try {
        await fetch(`${backendUrl}/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: `${name}\n${content}`, channelId })
        });
        document.getElementById('msgInput').value = '';
        document.getElementById('nameInput').value = '';
        fetchMessages();
      } catch (err) {
        console.error('Error sending message:', err);
      }
    }

    document.getElementById('uploadForm').addEventListener('submit', async e => {
      e.preventDefault();
      const channelId = getSelectedChannelId();
      const formData = new FormData();
      const file = document.getElementById('fileInput').files[0];
      formData.append('file', file);
      formData.append('channelId', channelId);
      try {
        await fetch(`${backendUrl}/upload`, {
          method: 'POST',
          body: formData
        });
        document.getElementById('fileInput').value = '';
        fetchMessages();
      } catch (err) {
        console.error('Error uploading file:', err);
      }
    });
    document.getElementById('channelSelector').addEventListener('change', fetchMessages);
    document.getElementById('sendForm').addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('nameInput').value.trim();
      const msg = document.getElementById('msgInput').value.trim();
      if (name && msg) sendMessage(name, msg);
    });
    fetchMessages();
    setInterval(fetchMessages, 5000);