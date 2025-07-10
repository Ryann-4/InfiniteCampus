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
      const imageRegex = /(https?:\/\/[^\s]+\.(png|jpg|jpeg|gif|webp))/i;
      const match = msg.content.match(imageRegex);
      let imageHTML = '';
      if (match) {
        imageHTML = `<br><img class="message-img" src="${match[1]}" alt="image">`;
      }
      li.innerHTML = `
        <img src="${avatarUrl}" class="avatar">
        <div class="content">
          <strong>${msg.author.username}</strong>
          <div>${msg.content}</div>
          ${imageHTML}
          <div class="timestamp">${timestamp}</div>
        </div>`;
      list.prepend(li);
    });
  } catch (err) {
    console.error('Error fetching messages:', err);
  }
}

async function sendMessage(name, content) {
  const channelId = getSelectedChannelId();
  try {
    await fetch(`${backendUrl}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `${name}\n${content}`,
        channelId
      })
    });
    document.getElementById('msgInput').value = '';
    document.getElementById('nameInput').value = '';
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
				if (name && msg) sendMessage(name, msg);
			});
			fetchMessages();
			setInterval(fetchMessages, 5000);
