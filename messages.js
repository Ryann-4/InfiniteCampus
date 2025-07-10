const backendUrl = 'https://discord-proxy1.onrender.com';

function getSelectedChannelId() {
  return document.getElementById('channelSelector').value;
}

async function fetchMessages() {
  const channelId = getSelectedChannelId();
  try {
    const res = await fetch(`${backendUrl}/api/messages?channelId=${channelId}`);
    const data = await res.json();
    const list = document.getElementById('messages');
    list.innerHTML = '';
    data.reverse().forEach(msg => {
      const li = document.createElement('li');
      const avatarUrl = msg.author.avatar
        ? `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/0.png`;
      const timestamp = new Date(msg.timestamp).toLocaleString();

      const imageRegex = /(https?:\/\/[^\s]+?\.(png|jpe?g|gif|webp)(\?[^\s]*)?)/gi;
      let formattedContent = msg.content.replace(imageRegex, (url) => {
        return `<br><img class="message-img" src="${url}" alt="image">`;
      });

      // Handle attachments
      if (msg.attachments && msg.attachments.length > 0) {
        msg.attachments.forEach(att => {
          if (att.content_type?.startsWith('image/')) {
            formattedContent += `<br><img class="message-img" src="${att.url}" alt="image">`;
          } else if (att.content_type?.startsWith('video/')) {
            formattedContent += `<br><video class="message-img" controls src="${att.url}"></video>`;
          } else if (att.content_type?.startsWith('audio/')) {
            formattedContent += `<br><audio controls src="${att.url}"></audio>`;
          } else {
            formattedContent += `<br><a href="${att.url}" target="_blank" style="color: lightblue;">📎 ${att.filename}</a>`;
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
    document.getElementById('fileLabel').textContent = ''; // Clear filename text

    fetchMessages();
  } catch (err) {
    console.error('Error sending message:', err);
  }
}

document.getElementById('channelSelector').addEventListener('change', fetchMessages);

document.getElementById('sendForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('nameInput').value.trim();
  const msg = document.getElementById('msgInput').value.trim();
  const file = document.getElementById('imageInput').files[0];
  if (name && (msg || file)) sendMessage(name, msg, file);
});

// Display selected filename
document.getElementById('imageInput').addEventListener('change', function () {
  const fileLabel = document.getElementById('fileLabel');
  if (this.files.length > 0) {
    fileLabel.textContent = `Selected: ${this.files[0].name}`;
  } else {
    fileLabel.textContent = '';
  }
});

fetchMessages();
setInterval(fetchMessages, 10000);
