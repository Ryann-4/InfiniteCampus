const backendUrl = 'https://marginally-humble-jennet.ngrok-free.app';
const apiMessagesUrl = `${backendUrl}/api/messages`;
function getSelectedChannelId() {
  return document.getElementById('channelSelector').value;
}
let currentChannelId = getSelectedChannelId();

async function fetchMessages() {
  const channelId = getSelectedChannelId();
  try {
    const res = await fetch(`${apiMessagesUrl}?channelId=${channelId}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    });
    const data = await res.json();
    const list = document.getElementById('messages');

    // Store IDs of messages currently in the DOM
    const existingMessageIds = new Set(
      [...list.children].map(li => li.dataset.id)
    );

    // Go through messages in reverse order (oldest first)
    for (const msg of data.reverse()) {
      if (existingMessageIds.has(msg.id)) continue; // Skip duplicates

      const li = document.createElement('li');
      li.dataset.id = msg.id; // Store ID for future duplicate checks

      // Display name and server tag
      const displayName = msg.member?.nick || msg.author.username;
      const serverTag = msg.member?.guild_tag ? ` [${msg.member.guild_tag}]` : '';
      const displayNameWithTag = displayName + serverTag;

      // Avatar
      const avatarUrl = msg.author.avatar
        ? `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/0.png`;

      const timestamp = new Date(msg.timestamp).toLocaleString();

      // Mentions replacement
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

      // Images from message content
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

      // Reply display
      let replyHTML = '';
      if (msg.referenced_message) {
        const replyAuthor = msg.referenced_message.author?.username || 'Unknown';
        const replyContent = msg.referenced_message.content || '[no content]';
        replyHTML = `
          <div class="reply" style="font-size:0.85em;color:#666;border-left:3px solid #ccc;padding-left:5px;margin-bottom:4px;">
            Replying to <strong>${replyAuthor}</strong>: ${replyContent}
          </div>
        `;
      }

      // Reactions
      let reactionsHTML = '';
      if (msg.reactions?.length) {
        reactionsHTML = `<div class="reactions" style="margin-top:4px;">` +
          msg.reactions.map(r => 
            `<span style="border:1px solid #ccc;border-radius:4px;padding:2px 4px;margin-right:2px;">${r.emoji.name} ${r.count}</span>`
          ).join('') +
          `</div>`;
      }

      li.innerHTML = `
        <img src="${avatarUrl}" class="avatar" style="width:40px;height:40px;border-radius:50%;vertical-align:middle;">
        <div class="content" style="display:inline-block;vertical-align:middle;margin-left:10px;">
          <strong>${displayNameWithTag}</strong>
          ${replyHTML}
          <div>${contentWithMentions}${imagesHTML}</div>
          ${attachmentsHTML}
          ${reactionsHTML}
          <div class="timestamp" style="font-size:0.8em;color:#888;">${timestamp}</div>
        </div>
      `;

      list.prepend(li); // Add new message without clearing old ones
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