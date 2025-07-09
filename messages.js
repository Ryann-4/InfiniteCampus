const backendUrl = 'https://discord-proxy1.onrender.com';
			async function fetchMessages() {
				try {
					const res = await fetch(backendUrl + '/api/messages');
					const data = await res.json();
					const list = document.getElementById('messages');
					list.innerHTML = '';
					data.reverse().forEach(msg => {
						const li = document.createElement('li');
						const avatarUrl = msg.author.avatar
						? `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`
						: `https://cdn.discordapp.com/embed/avatars/0.png`;
						const timestamp = new Date(msg.timestamp).toLocaleString();
						let messageContent = msg.content;
						const imageRegex = /(https?:\/\/[^\s]+\.(png|jpg|jpeg|gif|webp))/i;
						const match = messageContent.match(imageRegex);
						let imageHTML = '';
						if (match) {
							imageHTML = `<br><img class="message-img" src="${match[1]}" alt="image">`;
						}
						li.innerHTML = `
							<img src="${avatarUrl}" class="avatar">
							<div class="content">
								<strong>${msg.author.username}</strong>
								<div>${messageContent}</div>
								${imageHTML}
								<div class="timestamp">${timestamp}</div>
							</div>
						`;
						list.prepend(li);
					});
				} catch (err) {
					console.error('ERR#10 Error fetching messages:', err);
				}
			}
			async function sendMessage(name, content) {
				try {
					await fetch(backendUrl + '/send', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						body: `message=${encodeURIComponent(name + "\n" + content)}`
					});
					document.getElementById('msgInput').value = '';
					document.getElementById('nameInput').value = '';
					fetchMessages();
				} catch (err) {
					console.error('ERR#11 Error sending message:', err);
				}
			}
			document.getElementById('sendForm').addEventListener('submit', (e) => {
				e.preventDefault();
				const name = document.getElementById('nameInput').value.trim();
				const msg = document.getElementById('msgInput').value.trim();
				if (name && msg) sendMessage(name, msg);
			});
			fetchMessages();
			setInterval(fetchMessages, 5000);