const backendUrl = 'https://included-touched-joey.ngrok-free.app';
const apiMessagesUrl = `${backendUrl}/api/messages`;
const widgetUrl = 'https://discord.com/api/guilds/1002698920809463808/widget.json';
let widgetData = null;
let displayedMessageIds = new Set();
let currentChannelId = getSelectedChannelId();
let currentChannelToken = Symbol();
let currentReactMessageId = null;
const requestQueue = [];
let isProcessingQueue = false;
const RATE_LIMIT_DELAY = 3000;
async function processQueue() {
    if (isProcessingQueue || requestQueue.length === 0) return;
    isProcessingQueue = true;
    while (requestQueue.length > 0) {
        const fn = requestQueue.shift();
        try { await fn(); } catch(err){ console.error(err); }
        await new Promise(r => setTimeout(r, RATE_LIMIT_DELAY));
    }
    isProcessingQueue = false;
}
function enqueueRequest(fn){ requestQueue.push(fn); processQueue(); }
async function fetchWidget() {
    try { widgetData = await (await fetch(widgetUrl)).json(); } catch { widgetData = null; }
}
fetchWidget();
setInterval(fetchWidget, 30000);
function getSelectedChannelId(){ return document.getElementById('channelSelector').value; }
function getStatusImage(status){
    switch(status){
        case 'online': return 'https://codehs.com/uploads/32492fbd9c7975781bec905cc80efbde';
        case 'idle': return 'https://codehs.com/uploads/366cef0d856f621ae394ef8ca02c0807';
        case 'dnd': return 'https://codehs.com/uploads/ad7edef57db7e5c9eab58f45b9b8d7a4';
        default: return 'https://codehs.com/uploads/1837fc15433ac1289c3b36ec975fbc56';
    }
}
function getStatusFromWidget(globalName){
    if(globalName==='Dad Bot') return 'online';
    if(!widgetData?.members) return 'offline';
    const member = widgetData.members.find(m=>m.username===globalName||m.nick===globalName);
    return member?.status||'offline';
}
function renderTempMessage(content, type='text'){
    const list = document.getElementById('messages');
    const li = document.createElement('li');
    li.classList.add('temp-message');
    li.textContent = type==='text'?`Sending: ${content}...`:`Uploading: ${content}...`;
    list.prepend(li);
    return li;
}
async function renderMessage(msg, list){
    if(displayedMessageIds.has(msg.id)) return updateReactions(msg);
    const li = document.createElement('li');
    list.prepend(li);
    const avatarImg = document.createElement('img');
    avatarImg.classList.add('avatar');
    avatarImg.src = msg.author.avatar
        ? `https://cdn.discordapp.com/avatars/${msg.author.id}/${msg.author.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/0.png`;
    li.appendChild(avatarImg);
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content');
    li.appendChild(contentDiv);
    const serverTag = msg.author.clan?.tag || '';
    const displayName = msg.author.global_name || msg.author.username;
    const statusColor = getStatusFromWidget(displayName);
    const timestamp = new Date(msg.timestamp).toLocaleString();
    let contentWithMentions = msg.content || '';
    if(msg.mentions?.length){
        msg.mentions.forEach(u=>{
            const name = u.global_name || u.username;
            contentWithMentions = contentWithMentions.replace(new RegExp(`<@!?${u.id}>`,'g'),`@${name}`);
        });
    }
    let contentHTML = `<strong>${displayName}</strong>
        <span style="margin-left:5px;color:#888;${serverTag?'border:1px solid white;border-radius:5px;padding:0 4px;':''}">${serverTag}</span>
        <img src="${getStatusImage(statusColor)}" style="width:16px;height:16px;margin-left:5px;vertical-align:middle;">
        <div>${contentWithMentions}</div>`;
    if(msg.attachments?.length){
        msg.attachments.forEach(att=>{
            const url = att.url, name = att.filename.toLowerCase();
            if(/\.(png|jpg|jpeg|gif|webp)$/.test(name)) contentHTML += `<br><img src="${url}" style="max-width:300px;">`;
            else contentHTML += `<br><a href="${url}" target="_blank" rel="noopener">${att.filename}</a>`;
        });
    }
    if(msg.referenced_message){
        const replyAuthor = msg.referenced_message.author;
        const replyDisplayName = replyAuthor.global_name || replyAuthor.username;
        const replyContent = msg.referenced_message.content || '[no content]';
        contentHTML += `<div class="reply-box">Replying To <strong>${replyDisplayName}</strong>: ${replyContent}</div>`;
    }
    if(msg.reactions?.length){
        contentHTML += `<div class="reactions" style="margin-top:5px;">`;
        msg.reactions.forEach(r=>{
            contentHTML += `<span class="reaction-btn" data-id="${msg.id}" data-emoji="${r.emoji.name}">${r.emoji.name} ${r.count}</span>`;
        });
        contentHTML += `</div>`;
    }
    contentHTML += `<div class="timestamp">${timestamp}</div>
                    <span class="reaction-trigger" data-id="${msg.id}">React</span>`;
    contentDiv.innerHTML = contentHTML;
    displayedMessageIds.add(msg.id);
}
function updateReactions(msg){
    const li = document.querySelector(`.reaction-trigger[data-id="${msg.id}"]`)?.closest('li');
    if(!li) return;
    let reactionsHTML = '';
    if(msg.reactions?.length){
        reactionsHTML = `<div class="reactions" style="margin-top:5px;">`;
        msg.reactions.forEach(r => {
            reactionsHTML += `<span class="reaction-btn" data-id="${msg.id}" data-emoji="${r.emoji.name}">${r.emoji.name} ${r.count}</span>`;
        });
        reactionsHTML += `</div>`;
    }
    const oldReactions = li.querySelector('.reactions');
    if(oldReactions) oldReactions.replaceWith(new DOMParser().parseFromString(reactionsHTML,'text/html').body.firstChild);
    else li.querySelector('.content').insertAdjacentHTML('beforeend', reactionsHTML);
}
async function fetchMessages(token=currentChannelToken){
    const channelId = currentChannelId;
    try{
        const res = await fetch(`${apiMessagesUrl}?channelId=${channelId}`);
        const data = await res.json();
        const sorted = data.sort((a,b)=>new Date(a.timestamp)-new Date(b.timestamp));
        for(const msg of sorted){
            if(token !== currentChannelToken) return;
            await renderMessage(msg, document.getElementById('messages'));
        }
    } catch(err){ console.error(err); }
}
setInterval(()=>enqueueRequest(()=>fetchMessages(currentChannelToken)),3000);
document.getElementById('channelSelector').addEventListener('change',()=>{
    currentChannelId = getSelectedChannelId();
    currentChannelToken = Symbol();
    displayedMessageIds.clear();
    document.getElementById('messages').innerHTML='';
    enqueueRequest(()=>fetchMessages(currentChannelToken));
});
const emojiPicker = document.getElementById('emojiPicker');
document.body.addEventListener('click',e=>{
    if(e.target.classList.contains('reaction-trigger')){
        currentReactMessageId = e.target.dataset.id;
        const rect = e.target.getBoundingClientRect();
        emojiPicker.style.left = rect.left + 'px';
        emojiPicker.style.top = rect.bottom + 'px';
        emojiPicker.style.display = 'block';
    } else if(e.target.classList.contains('reaction-btn')){
        const messageId = e.target.dataset.id;
        const emoji = e.target.dataset.emoji;
        const countSpan = e.target;
        countSpan.textContent = `${emoji} ${parseInt(countSpan.textContent.split(' ')[1]||0)+1}`;
        enqueueRequest(()=>fetch('/react',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({messageId, emoji, channelId:currentChannelId})
        }).catch(err=>console.error(err)));
    } else if(!emojiPicker.contains(e.target)) emojiPicker.style.display='none';
});
emojiPicker.addEventListener('emoji-click',event=>{
    const emoji = event.detail.unicode;
    const messageId = currentReactMessageId;
    const li = document.querySelector(`.reaction-trigger[data-id="${messageId}"]`)?.closest('li');
    if(li){
        let existing = li.querySelector(`.reaction-btn[data-emoji="${emoji}"]`);
        if(existing) existing.textContent=`${emoji} ${parseInt(existing.textContent.split(' ')[1]||0)+1}`;
        else li.querySelector('.content').insertAdjacentHTML('beforeend',`<span class="reaction-btn" data-id="${messageId}" data-emoji="${emoji}">${emoji} 1</span>`);
    }
    enqueueRequest(()=>fetch('/react',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({messageId, emoji, channelId:currentChannelId})
    }).catch(err=>console.error(err)));
    emojiPicker.style.display='none';
});
document.getElementById('sendForm').addEventListener('submit',e=>{
    e.preventDefault();
    const name = document.getElementById('nameInput').value.trim();
    const message = document.getElementById('msgInput').value.trim();
    if(!name || !message) return;
    const tempLi = renderTempMessage(`${name}: ${message}`);
    document.getElementById('msgInput').value='';
    enqueueRequest(async()=>{
        await fetch('/send',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({message:`${name}: ${message}`, channelId:currentChannelId})
        });
        tempLi.remove();
    });
});
const uploadForm = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const fileLabel = document.getElementById('fileLabel');
fileInput.addEventListener('change',()=>{ fileLabel.textContent = fileInput.files.length>0 ? fileInput.files[0].name : 'Select A File'; });
uploadForm.addEventListener('submit', e=>{
    e.preventDefault();
    if(!fileInput.files.length) return alert('No File Selected');
    const tempLi = renderTempMessage(fileInput.files[0].name, 'file');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('channelId', currentChannelId);
    enqueueRequest(()=>fetch('/upload',{
        method:'POST',
        body:formData
    }).then(res=>{
        tempLi.remove();
        if(!res.ok) res.text().then(text=>alert('Upload Failed:'+text));
        fileInput.value=''; fileLabel.textContent='Select A File';
    }).catch(err=>console.error(err)));
});
enqueueRequest(()=>fetchMessages(currentChannelToken));