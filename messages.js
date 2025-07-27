function getSelectedChannelId() {
  return document.getElementById('channelSelector').value;
}
const displayedMessageIds = new Map();
async function fetchMessages() {
  const loadingEl = document.getElementById('loadingMessage');
  loadingEl.style.display = 'block';
  const channelId = getSelectedChannelId();
  let channelSet = displayedMessageIds.get(channelId);
  if (!channelSet) {
    channelSet = new Set();
    displayedMessageIds.set(channelId, channelSet);
  }
  try {
    const res = await fetch(`${i}/api/messages?channelId=${channelId}`);
    const data = await res.json();
    const list = document.getElementById('messages');
    if (data.length === 0) {
      loadingEl.textContent = 'No Messages Here Yet.';
    } else {
      loadingEl.style.display = 'none';
    }
    data.reverse().forEach(msg => {
      if (channelSet.has(msg.id)) return;
      channelSet.add(msg.id);
      const li = document.createElement('li');
      const avatarUrl = msg.author.avatar
        ? `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/0.png`;
      const timestamp = new Date(msg.timestamp).toLocaleString();
      const imageRegex = /(https?:\/\/[^\s]+?\.(png|jpe?g|gif|webp)(\?[^\s]*)?)/gi;
      let formattedContent = msg.content.replace(imageRegex, (url) => {
        return `<br><img class="message-img" src="${url}" alt="image">`;
      });
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
    console.error('ERR#10 Error Fetching Messages:', err);
    loadingEl.textContent = 'ERR#12 Failed To Load Messages.';
  }
}
async function sendMessage(name, content, file) {
  const channelId = getSelectedChannelId();
  const formData = new FormData();
  formData.append('channelId', channelId);
  formData.append('message', `${name}\n${content}`);
  if (file) {
    formData.append('file', file);
  }
  try {
    await fetch(`${i}/send`, {
      method: 'POST',
      body: formData
    });
    document.getElementById('msgInput').value = '';
    document.getElementById('imageInput').value = '';
    document.getElementById('fileLabel').textContent = '';
    fetchMessages();
  } catch (err) {
    console.error('ERR#11 Error Sending Message:', err);
  }
}
document.getElementById('channelSelector').addEventListener('change', () => {
  const channelId = getSelectedChannelId();
  const list = document.getElementById('messages');
  list.innerHTML = '';
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
document.getElementById('imageInput').addEventListener('change', function () {
  const fileLabel = document.getElementById('fileLabel');
  if (this.files.length > 0) {
    fileLabel.textContent = `Selected: ${this.files[0].name}`;
  } else {
    fileLabel.textContent = '';
  }
});
fetchMessages();
setInterval(fetchMessages, 5000);