const backendUrl = 'https://discord-proxy1.onrender.com';

function getSelectedChannelId() {
  return document.getElementById('channelSelector').value;
}

// Map to track displayed message IDs per channel
const displayedMessageIds = new Map();

async function fetchMessages() {
  const channelId = getSelectedChannelId();
  let channelSet = displayedMessageIds.get(channelId);
  if (!channelSet) {
    channelSet = new Set();
    displayedMessageIds.set(channelId, channelSet);
  }

  try {
    const res = await fetch(`${backendUrl}/api/messages?channelId=${channelId}`);
    const data = await res.json();
    const list = document.getElementById('messages');

    // Append only new messages without clearing the list to avoid resetting media playback
    data.reverse().forEach(msg => {
      if (channelSet.has(msg.id)) return; // Skip if already displayed

      channelSet.add(msg.id);

      const li = document.createElement('li');
      const avatarUrl = msg.author.avatar
        ? `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/0.png`;
      const timestamp = new Date(msg.timestamp).toLocaleString();

      // Replace any image URLs in the message content
      const imageRegex = /(https?:\/\/[^\s]+?\.(png|jpe?g|gif|webp)(\?[^\s]*)?)/gi;
      let formattedContent = msg.content.replace(imageRegex, (url) => {
        return `<br><img class="message-img" src="${url}" alt="image">`;
      });

      // Check for attachments (image, video, audio, etc.)
      if (msg.attachments && msg.attachments.length > 0) {
        msg.attachments.forEach(attachment => {
          const url = attachment.url;
          const type = attachment.content_type || '';

          if (type.startsWith('image/') || /\.(png|jpe?g|gif|webp)$/i.test(attachment.filename)) {
            formattedContent += `<br><img class="message-img" src="${url}" alt="attachment">`;
          } else if (type.startsWith('video/') || /\.(mp4|mov|webm|ogg)$/i.test(attachment.filename)) {
            formattedContent += `<br><video controls class="message-video" src="${url}"></video>`;
          } else if (type.startsWith('audio/') || /\.(mp3|wav|ogg)$/i.test(attachment.filename)) {
            formattedContent += `<br><audio controls class="message-audio" src="${url}"></audio>`;
          } else {
            // For other files, show a clickable filename link
            formattedContent += `<br><a href="${url}" target="_blank" class="message-file">${attachment.filename}</a>`;
          }
        });
      }

      li.innerHTML = `
        <img src="${avatarUrl}" class="avatar">
        <div class="content">
          <strong>${msg.author.username}</strong>
          <div>${formattedContent}</div>
          <div class="timestamp">${timestamp}</div>
        </div>`;

      list.prepend(li);
    });
  } catch (err) {
    console.error('Error fetching messages:', err);
  }
}

// Send message with optional file
async function sendMessage(name, content, file) {
  const channelId = getSelectedChannelId();
  const formData = new FormData();
  formData.append('channelId', channelId);
  formData.append('message', `${name}\n${content}`);
  if (file) {
    formData.append('file', file);
  }

  try {
    await fetch(`${backendUrl}/send`, {
      method: 'POST',
      body: formData
    });

    document.getElementById('msgInput').value = '';
    document.getElementById('nameInput').value = '';
    document.getElementById('imageInput').value = '';
    fetchMessages();
  } catch (err) {
    console.error('Error sending message:', err);
  }
}

// Clear messages and reset displayed IDs on channel change
document.getElementById('channelSelector').addEventListener('change', () => {
  const channelId = getSelectedChannelId();
  const list = document.getElementById('messages');
  list.innerHTML = ''; // Clear messages from previous channel

  // Reset the displayed messages for the new channel
  displayedMessageIds.set(channelId, new Set());

  fetchMessages();
});

document.getElementById('sendForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('nameInput').value.trim();
  const msg = document.getElementById('msgInput').value.trim();
  const file = document.getElementById('imageInput').files[0];
  if (name && (msg || file)) sendMessage(name, msg, file);
});

fetchMessages();
setInterval(fetchMessages, 5000);
