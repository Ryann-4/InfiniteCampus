const backendUrl = 'https://marginally-humble-jennet.ngrok-free.app';
const apiMessagesUrl = `${backendUrl}/api/messages`;
function getSelectedChannelId() {
  return document.getElementById('channelSelector').value;
}
async function fetchMessages() {
  const channelId = getSelectedChannelId();
  try {
    const res = await fetch(`${apiMessagesUrl}?channelId=${channelId}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    });
    const data = await res.json();
    const list = document.getElementById('messages');
    list.innerHTML = '';
    for (const msg of data.reverse()) {
      const li = document.createElement('li');
      const displayName = msg.member?.nick || msg.author.username;
      let serverTag = '';
      if (msg.clan?.identity_enabled && msg.clan.tag) {
        serverTag = ` [${msg.clan.tag}]`;
      } else if (msg.primary_guild?.identity_enabled && msg.primary_guild.tag) {
        serverTag = ` [${msg.primary_guild.tag}]`;
      }
      const displayNameWithTag = displayName + serverTag;
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
      let imagesHTML = '';
      const imageRegex = /(https?:\/\/[^\s]+\.(png|jpg|jpeg|gif|webp))/gi;
      let match;
      while ((match = imageRegex.exec(contentWithMentions)) !== null) {
        imagesHTML += `<br><img class="message-img" src="${match[1]}" style="max-width:300px;">`;
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
      li.innerHTML = `
        <img src="${avatarUrl}" class="avatar" style="width:40px;height:40px;border-radius:50%;vertical-align:middle;">
        <div class="content" style="display:inline-block;vertical-align:middle;margin-left:10px;">
          <strong>${displayNameWithTag}</strong>
          <div>${contentWithMentions}${imagesHTML}</div>
          ${attachmentsHTML}
          <div class="timestamp" style="font-size:0.8em;color:#888;">${timestamp}</div>
        </div>
      `;
      list.prepend(li);
    }
  } catch (err) {
    console.error('Error Fetching Messages:', err);
  }
}
async function sendMessage(name, content) {
  const channelId = getSelectedChannelId();
  try {
    await fetch(`${backendUrl}/send`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      body: JSON.stringify({ message: `${name}\n${content}`, channelId })
    });
    document.getElementById('msgInput').value = '';
    document.getElementById('nameInput').value = '';
    fetchMessages();
  } catch (err) {
    console.error('Error Sending Message:', err);
  }
}
async function uploadFile() {
  const channelId = getSelectedChannelId();
  const file = document.getElementById('fileInput').files[0];
  if (!file) return;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('channelId', channelId);
  try {
    await fetch(`${backendUrl}/upload`, {
      method: 'POST',
      body: formData,
      headers: { 'ngrok-skip-browser-warning': 'true' }
    });
    document.getElementById('fileInput').value = '';
    fetchMessages();
  } catch (err) {
    console.error('Error Uploading File:', err);
  }
}
document.getElementById('sendForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('nameInput').value.trim();
  const msg = document.getElementById('msgInput').value.trim();
  if (name && msg) sendMessage(name, msg);
});
document.getElementById('uploadForm').addEventListener('submit', e => {
  e.preventDefault();
  uploadFile();
});
document.getElementById('channelSelector').addEventListener('change', fetchMessages);
fetchMessages();
setInterval(fetchMessages, 5000);