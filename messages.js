const backendUrl = 'https://marginally-humble-jennet.ngrok-free.app';
const apiMessagesUrl = `${backendUrl}/api/messages`;
function getSelectedChannelId() {
  return document.getElementById('channelSelector').value;
}
let currentChannelId = null; // Track current channel
function switchChannel(channelId) {
  if (currentChannelId !== channelId) {
    currentChannelId = channelId;
    const list = document.getElementById('messages');
    list.innerHTML = ''; // Clear only when channel changes
    fetchMessages(); // Fetch fresh messages for new channel
  }
}

async function fetchMessages() {
  if (!currentChannelId) return; // No channel selected yet

  try {
    const res = await fetch(`${apiMessagesUrl}?channelId=${currentChannelId}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    });
    const data = await res.json();
    const list = document.getElementById('messages');

    // Get IDs already in DOM
    const existingMessageIds = new Set(
      [...list.children].map(li => li.dataset.id)
    );

    // Render oldest first so prepend keeps order correct
    for (const msg of data.reverse()) {
      if (existingMessageIds.has(msg.id)) continue;

      const li = document.createElement('li');
      li.dataset.id = msg.id;

      const displayName = msg.member?.nick || msg.author.username;
      const serverTag = msg.member?.guild_tag ? ` [${msg.member.guild_tag}]` : '';
      const avatarUrl = msg.author.avatar
        ? `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/0.png`;

      let contentWithMentions = msg.content || '';
      if (msg.mentions?.length) {
        msg.mentions.forEach(u => {
          const name = u.nick || u.username;
          contentWithMentions = contentWithMentions.replace(
            new RegExp(`<@!?${u.id}>`, 'g'),
            `@${name}`
          );
        });
      }

      // Images in content
      let imagesHTML = '';
      const imageRegex = /(https?:\/\/[^\s]+\.(png|jpg|jpeg|gif|webp))/gi;
      let match;
      while ((match = imageRegex.exec(contentWithMentions)) !== null) {
        imagesHTML += `<br><img class="message-img" src="${match[1]}" style="max-width:300px;">`;
      }

      // Attachments
      let attachmentsHTML = '';
      if (msg.attachments?.length) {
        msg.attachments.forEach(att => {
          const url = att.url;
          const name = att.filename.toLowerCase();
          if (/\.(png|jpg|jpeg|gif|webp)$/.test(name)) {
            attachmentsHTML += `<br><img src="${url}" style="max-width:300px;">`;
          } else if (/\.(mp4|webm|mov)$/.test(name)) {
            attachmentsHTML += `<br><video controls style="max-width:300px;"><source src="${url}"></video>`;
          } else if (/\.(mp3|wav|ogg)$/.test(name)) {
            attachmentsHTML += `<br><audio controls><source src="${url}"></audio>`;
          } else {
            attachmentsHTML += `<br><a href="${url}" download>${att.filename}</a>`;
          }
        });
      }

      // Reply
      let replyHTML = '';
      if (msg.referenced_message) {
        const replyAuthor = msg.referenced_message.author?.username || 'Unknown';
        const replyContent = msg.referenced_message.content || '[no content]';
        replyHTML = `
          <div style="font-size:0.85em;color:#666;border-left:3px solid #ccc;padding-left:5px;margin-bottom:4px;">
            Replying to <strong>${replyAuthor}</strong>: ${replyContent}
          </div>
        `;
      }

      // Reactions
      let reactionsHTML = '';
      if (msg.reactions?.length) {
        reactionsHTML = `<div style="margin-top:4px;">` +
          msg.reactions.map(r => 
            `<span style="border:1px solid #ccc;border-radius:4px;padding:2px 4px;margin-right:2px;">${r.emoji.name} ${r.count}</span>`
          ).join('') +
          `</div>`;
      }

      li.innerHTML = `
        <img src="${avatarUrl}" style="width:40px;height:40px;border-radius:50%;vertical-align:middle;">
        <div style="display:inline-block;vertical-align:middle;margin-left:10px;">
          <strong>${displayName}${serverTag}</strong>
          ${replyHTML}
          <div>${contentWithMentions}${imagesHTML}</div>
          ${attachmentsHTML}
          ${reactionsHTML}
          <div style="font-size:0.8em;color:#888;">${new Date(msg.timestamp).toLocaleString()}</div>
        </div>
      `;

      list.prepend(li);
    }
  } catch (err) {
    console.error('Error Fetching Messages:', err);
  }
}


document.getElementById('channelSelector').addEventListener('change', () => {
  currentChannelId = getSelectedChannelId();
  fetchMessages();
});

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