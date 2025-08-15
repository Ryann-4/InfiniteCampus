const backendUrl = 'https://marginally-humble-jennet.ngrok-free.app';
const apiMessagesUrl = `${backendUrl}/api/messages`;
const widgetUrl = 'https://discord.com/api/guilds/1002698920809463808/widget.json';

let widgetData = null;

function getSelectedChannelId() {
  return document.getElementById('channelSelector').value;
}

let currentChannelId = getSelectedChannelId();

// Fetch the Discord widget periodically
async function fetchWidget() {
  try {
    const res = await fetch(widgetUrl);
    widgetData = await res.json();
  } catch (err) {
    console.error('Error fetching widget:', err);
    widgetData = null;
  }
}
fetchWidget();
setInterval(fetchWidget, 30000); // update every 30s

function getStatusColor(status) {
  switch (status) {
    case 'online': return 'green';
    case 'idle': return 'yellow';
    case 'dnd': return 'red';
    default: return 'grey'; // offline
  }
}

// Get member info by matching avatar URL
function getMemberInfoByAvatar(avatarUrl) {
  if (!widgetData || !widgetData.members) return { displayName: '', clanTag: '', statusColor: 'grey' };
  
  const member = widgetData.members.find(m => {
    const memberAvatar = m.avatar_url || '';
    return memberAvatar && avatarUrl.includes(memberAvatar.split('/').pop().split('.')[0]);
  });

  const displayName = member?.nick || '';
  const clanTag = member?.name?.split('#')[0] || '';
  const statusColor = getStatusColor(member?.status || 'offline');

  return { displayName, clanTag, statusColor };
}

// Track existing messages per channel
const messageIdsByChannel = {};

async function fetchMessages() {
  const channelId = getSelectedChannelId();
  const list = document.getElementById('messages');

  try {
    const res = await fetch(`${apiMessagesUrl}?channelId=${channelId}`, {
      headers: { 'ngrok-skip-browser-warning': 'true' }
    });
    const data = await res.json();

    // Remove messages that belong to another channel
    [...list.children].forEach(li => {
      if (li.dataset.channelId && li.dataset.channelId !== channelId) {
        li.remove();
      }
    });

    // Store IDs of messages currently in the DOM
    const existingMessageIds = new Set([...list.children].map(li => li.dataset.id));

    for (const msg of data.reverse()) {
      if (existingMessageIds.has(msg.id)) continue; // Skip duplicates

      const li = document.createElement('li');
      li.dataset.id = msg.id;
      li.dataset.channelId = channelId;

      const avatarUrl = msg.author.avatar
        ? `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/0.png`;

      // Get nickname, clan tag, and status from widget using avatar
      const { displayName, clanTag, statusColor } = getMemberInfoByAvatar(avatarUrl);

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
            attachmentsHTML += `<br><img class="message-img" src="${url}" alt="${name}" style="max-width:300px;">`;
          } else if (/\.(mp4|webm|mov)$/.test(name)) {
            attachmentsHTML += `<br><video controls style="max-width:300px;"><source src="${url}" type="video/${name.split('.').pop()}"></video>`;
          } else if (/\.(mp3|wav|ogg)$/.test(name)) {
            attachmentsHTML += `<br><audio controls><source src="${url}" type="audio/${name.split('.').pop()}"></audio>`;
          } else {
            attachmentsHTML += `<br><a href="${url}" download>${att.filename}</a>`;
          }
        });
      }

      // Replies
      let replyHTML = '';
      if (msg.referenced_message) {
        const replyAvatarUrl = msg.referenced_message.author?.avatar
          ? `https://cdn.discordapp.com/avatars/${msg.referenced_message.author.id}/${msg.referenced_message.author.avatar}.png`
          : `https://cdn.discordapp.com/embed/avatars/0.png`;
        const { displayName: replyName, clanTag: replyClan, statusColor: replyStatus } = getMemberInfoByAvatar(replyAvatarUrl);
        const replyContent = msg.referenced_message.content || '[no content]';
        replyHTML = `
          <div class="reply" style="font-size:0.85em;color:#666;border-left:3px solid #ccc;padding-left:5px;margin-bottom:4px;">
            Replying to <strong>${replyName}</strong> <span style="color:#888;">${replyClan}</span>
            <span style="display:inline-block;width:10px;height:10px;background-color:${replyStatus};border-radius:50%;margin-left:5px;"></span>
            : ${replyContent}
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
          <strong>${displayName}</strong>
          <span style="margin-left:5px;color:#888;">${clanTag}</span>
          <span style="display:inline-block;width:10px;height:10px;background-color:${statusColor};border-radius:50%;margin-left:5px;"></span>
          ${replyHTML}
          <div>${contentWithMentions}${imagesHTML}</div>
          ${attachmentsHTML}
          ${reactionsHTML}
          <div class="timestamp" style="font-size:0.8em;color:#888;">${timestamp}</div>
        </div>
      `;

      list.prepend(li);
    }
  } catch (err) {
    console.error('Error Fetching Messages:', err);
  }
}

// Switch channels
document.getElementById('channelSelector').addEventListener('change', () => {
  const channelId = getSelectedChannelId();
  const list = document.getElementById('messages');
  list.innerHTML = ''; // Clear old messages
  if (!messageIdsByChannel[channelId]) messageIdsByChannel[channelId] = new Set();
  fetchMessages();
});

// Send message
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

// Upload file
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

// Form listeners
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

// Initial fetch and interval
fetchMessages();
setInterval(fetchMessages, 5000);
