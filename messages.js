const backendUrl = 'https://marginally-humble-jennet.ngrok-free.app';
const apiMessagesUrl = `${backendUrl}/api/messages`;
const widgetUrl = 'https://discord.com/api/guilds/1002698920809463808/widget.json';
let widgetData = null;
async function fetchWidget() {
    try {
        const res = await fetch(widgetUrl);
        widgetData = await res.json();
    } catch (err) {
        console.error('Error Fetching Widget:', err);
        widgetData = null;
    }
}
fetchWidget();
setInterval(fetchWidget, 30000);
function getSelectedChannelId() {
    return document.getElementById('channelSelector').value;
}
function getStatusImage(status) {
    switch (status) {
        case 'online': return 'https://codehs.com/uploads/32492fbd9c7975781bec905cc80efbde';       // green circle
        case 'idle': return 'https://codehs.com/uploads/366cef0d856f621ae394ef8ca02c0807';           // yellow quarter moon
        case 'dnd': return 'https://codehs.com/uploads/ad7edef57db7e5c9eab58f45b9b8d7a4';             // do not enter sign
        default: return 'https://codehs.com/uploads/1837fc15433ac1289c3b36ec975fbc56';            // hollow grey circle
    }
}
function getStatusFromWidget(globalName) {
    if (globalName === 'Dad Bot') return 'online';
    if (!widgetData?.members) return 'offline';
    const member = widgetData.members.find(m => m.username === globalName || m.nick === globalName);
    return member?.status || 'offline';
}
let currentChannelId = getSelectedChannelId();
const messageIdsByChannel = {};
async function fetchMessages() {
    const channelId = getSelectedChannelId();
    const list = document.getElementById('messages');
    try {
        const res = await fetch(`${apiMessagesUrl}?channelId=${channelId}`, {
            headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        const data = await res.json();
        [...list.children].forEach(li => {
            if (li.dataset.channelId && li.dataset.channelId !== channelId) li.remove();
        });
        const existingMessageIds = new Set([...list.children].map(li => li.dataset.id));
        for (const msg of data.reverse()) {
            if (existingMessageIds.has(msg.id)) continue;
            const li = document.createElement('li');
            li.dataset.id = msg.id;
            li.dataset.channelId = channelId;
            const serverTag = msg.author.clan?.tag || '';
            const displayName = msg.author.global_name || msg.author.username;
            const username = msg.author.username;
            const avatarUrl = msg.author.avatar
                ? `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`
                : `https://cdn.discordapp.com/embed/avatars/0.png`;
            const statusColor = getStatusFromWidget(displayName);
            const timestamp = new Date(msg.timestamp).toLocaleString();
            let contentWithMentions = msg.content || '';
            if (msg.mentions?.length) {
                msg.mentions.forEach(u => {
                    const name = u.global_name || u.username;
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
            if (msg.attachments?.length) {
                msg.attachments.forEach(att => {
                    const url = att.url;
                    const name = att.filename.toLowerCase();
                    if (/\.(png|jpg|jpeg|gif|webp)$/.test(name)) attachmentsHTML += `<br><img src="${url}" alt="${name}" style="max-width:300px;">`;
                    else if (/\.(mp4|webm|mov)$/.test(name)) attachmentsHTML += `<br><video controls style="max-width:300px;"><source src="${url}" type="video/${name.split('.').pop()}"></video>`;
                    else if (/\.(mp3|wav|ogg)$/.test(name)) attachmentsHTML += `<br><audio controls><source src="${url}" type="audio/${name.split('.').pop()}"></audio>`;
                    else attachmentsHTML += `<br><a href="${url}" download>${att.filename}</a>`;
                });
            }
            let replyHTML = '';
            if (msg.referenced_message) {
                const replyAuthor = msg.referenced_message.author;
                const replyServerTag = replyAuthor.clan?.tag || '';
                const replyDisplayName = replyAuthor.global_name || replyAuthor.username;
                const replyStatusColor = getStatusFromWidget(replyDisplayName);
                const replyContent = msg.referenced_message.content || '[no content]';
                replyHTML = `
                    <div class="reply" style="font-size:0.85em;color:#666;border-left:3px solid #ccc;padding-left:5px;margin-bottom:4px;">
                        Replying to <strong>${replyDisplayName}</strong>
                        <span style="margin-left:5px;color:#888;${replyServerTag ? 'border:1px solid white;border-radius:5px;padding:0 4px;' : ''}">${replyServerTag}</span>
                        <img src="${getStatusImage(replyStatusColor)}" style="width:16px;height:16px;margin-left:5px;vertical-align:middle;">
                        : ${replyContent}
                    </div>
                `;
            }
            let reactionsHTML = '';
            if (msg.reactions?.length) {
                reactionsHTML = `<div class="reactions" style="margin-top:4px;">` +
                    msg.reactions.map(r => `<span style="border:1px solid #ccc;border-radius:4px;padding:2px 4px;margin-right:2px;">${r.emoji.name} ${r.count}</span>`).join('') +
                `</div>`;
            }
            li.innerHTML = `
                <img src="${avatarUrl}" class="avatar" style="width:40px;height:40px;border-radius:50%;vertical-align:middle;">
                <div class="content" style="display:inline-block;vertical-align:middle;margin-left:10px;">
                    <strong>${displayName}</strong>
                    <span style="margin-left:5px;color:#888;${serverTag ? 'border:1px solid white;border-radius:5px;padding:0 4px;' : ''}">${serverTag}</span>
                    <img src="${getStatusImage(statusColor)}" style="width:16px;height:16px;margin-left:5px;vertical-align:middle;">
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
document.getElementById('channelSelector').addEventListener('change', () => {
    const channelId = getSelectedChannelId();
    const list = document.getElementById('messages');
    list.innerHTML = '';
    if (!messageIdsByChannel[channelId]) messageIdsByChannel[channelId] = new Set();
    fetchMessages();
});
async function sendMessage(name, content) {
    const channelId = getSelectedChannelId();
    try {
        await fetch(`${backendUrl}/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json','ngrok-skip-browser-warning': 'true' },
            body: JSON.stringify({ message: `${name}\n${content}`, channelId })
        });
        document.getElementById('msgInput').value = '';
        document.getElementById('nameInput').value = '';
        fetchMessages();
    } catch (err) { console.error('Error Sending Message:', err); }
}
async function uploadFile() {
    const channelId = getSelectedChannelId();
    const file = document.getElementById('fileInput').files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('channelId', channelId);
    try {
        await fetch(`${backendUrl}/upload`, { method: 'POST', body: formData, headers: { 'ngrok-skip-browser-warning': 'true' } });
        document.getElementById('fileInput').value = '';
        fetchMessages();
    } catch (err) { console.error('Error Uploading File:', err); }
}
document.getElementById('sendForm').addEventListener('submit', e => { e.preventDefault(); sendMessage(document.getElementById('nameInput').value.trim(), document.getElementById('msgInput').value.trim()); });
document.getElementById('uploadForm').addEventListener('submit', e => { e.preventDefault(); uploadFile(); });
fetchMessages();
setInterval(fetchMessages, 5000);