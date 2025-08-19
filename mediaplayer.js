// --- DOM SELECTORS ---
const fileInput         = document.getElementById('fileInput');
const audio             = document.getElementById('audio');
const player            = document.getElementById('mediaPlayer');
const playPauseBtn      = document.getElementById('playPauseBtn');
const backBtn           = document.getElementById('backBtn');
const forwardBtn        = document.getElementById('forwardBtn');
const loopBtn           = document.getElementById('loopBtn');
const progressContainer = document.getElementById('progressContainer');
const progressBar       = document.getElementById('progressBar');
const timeDisplay       = document.getElementById('timeDisplay');
const filenameDisplay   = document.getElementById('filenameDisplay');
const playlistElement   = document.getElementById('playlist');
const coverArt          = document.getElementById('coverArt');

let playlist      = [];
let currentTrack  = 0;
let loopPlaylist  = false;
let db; // IndexedDB

// --- INIT DATABASE ---
function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("MusicDB", 1);
        request.onupgradeneeded = e => {
            db = e.target.result;
            const store = db.createObjectStore("songs", { keyPath: "id", autoIncrement: true });
        };
        request.onsuccess = e => { db = e.target.result; resolve(); };
        request.onerror = e => reject(e);
    });
}

// --- ADD SONG TO DB ---
function addSongToDB(file, thumbnail=null) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction("songs", "readwrite");
        const store = tx.objectStore("songs");
        const req = store.add({ name: file.name, blob: file, thumb: thumbnail });
        req.onsuccess = () => resolve();
        req.onerror   = e => reject(e);
    });
}

// --- GET ALL SONGS FROM DB ---
function getSongsFromDB() {
    return new Promise((resolve, reject) => {
        const tx = db.transaction("songs", "readonly");
        const store = tx.objectStore("songs");
        const req = store.getAll();
        req.onsuccess = e => resolve(e.target.result);
        req.onerror   = e => reject(e);
    });
}

// --- DELETE SONG FROM DB ---
function deleteAllSongsFromDB() {
    const tx = db.transaction("songs", "readwrite");
    tx.objectStore("songs").clear();
}

// --- INIT ---
window.addEventListener("DOMContentLoaded", async () => {
    await initDB();
    const songs = await getSongsFromDB();
    playlist = songs.slice(0,20).map(s => ({ id: s.id, name: s.name, blob: s.blob, thumb: s.thumb }));
    if (playlist.length) {
        currentTrack = 0;
        updatePlaylistUI();
        loadTrack(currentTrack);
        player.style.display = 'block';
    }
});

// --- FILE INPUT ---
fileInput.addEventListener("change", async () => {
    const files = Array.from(fileInput.files).slice(0, 20);
    if (!files.length) return;
    deleteAllSongsFromDB();
    playlist = [];
    for (const file of files) {
        await addSongToDB(file);
    }
    const songs = await getSongsFromDB();
    playlist = songs.slice(0,20).map(s => ({ id: s.id, name: s.name, blob: s.blob, thumb: s.thumb }));
    currentTrack = 0;
    updatePlaylistUI();
    loadTrack(currentTrack);
    player.style.display = 'block';
});

// --- PLAYLIST UI ---
function updatePlaylistUI() {
    playlistElement.innerHTML = '';
    playlist.forEach((song, index) => {
        const li = document.createElement('li');
        li.className = index === currentTrack ? 'active' : '';
        li.classList.add('playlist-item');
        li.dataset.index = index;

        const nameSpan = document.createElement('span');
        nameSpan.classList.add('txt');
        nameSpan.textContent = `${index+1}. ${song.name.replace(/\.mp3$/i,'')}`;
        li.appendChild(nameSpan);

        li.addEventListener('click', () => { currentTrack=index; loadTrack(currentTrack); audio.play(); playPauseBtn.textContent='||'; });
        playlistElement.appendChild(li);
    });
}

// --- CREATE POPUP ---
function createPopup() {
    if(document.getElementById("playerPopup")) return;
    const popup = document.createElement("div");
    popup.id = "playerPopup";
    popup.innerHTML = `
        <div class="popup-header">
            <span id="popupFileName"></span>
            <button id="popupClose" style="float:right;">✖</button>
        </div>
        <div class="popup-controls">
            <button class="mediabtns" id="popupBack">⏮</button>
            <button class="mediabtns" id="popupPlay">▶</button>
            <button class="mediabtns" id="popupNext">⏭</button>
            <button class="mediabtns" id="popupLoop">🔁 Off</button>
        </div>
        <div class="popup-bar"><div id="popupBarFill"></div></div>
        <div id="popupTime">0:00 / 0:00</div>
    `;
    document.body.appendChild(popup);
    const style = popup.style;
    style.position="fixed"; style.top="20px"; style.right="20px"; style.width="280px"; style.padding="12px"; style.color="white";
    style.borderRadius="12px"; style.backgroundSize="cover"; style.backgroundPosition="center";
    style.boxShadow="0 4px 12px rgba(0,0,0,0.5)"; style.fontFamily="sans-serif"; style.zIndex="9999"; style.cursor="move";

    // Draggable
    let offsetX, offsetY, isDown=false;
    popup.addEventListener('mousedown', e=>{ isDown=true; offsetX=e.offsetX; offsetY=e.offsetY; });
    window.addEventListener('mouseup', e=>{ isDown=false; });
    window.addEventListener('mousemove', e=>{ if(!isDown) return; popup.style.left=(e.clientX-offsetX)+'px'; popup.style.top=(e.clientY-offsetY)+'px'; });

    // Close button
    document.getElementById("popupClose").addEventListener('click', ()=>{ audio.pause(); popup.remove(); });
    document.getElementById("popupBarFill").style.height="6px"; document.getElementById("popupBarFill").style.background="lime";
}

// --- LOAD TRACK ---
async function loadTrack(index) {
    createPopup();
    const song = playlist[index];
    if(!song) return;
    audio.src = URL.createObjectURL(song.blob);
    audio.load();
    const cleanName = song.name.replace(/\.mp3$/i,'');
    filenameDisplay.innerHTML=`<span style="text-align:center">${cleanName}</span>`;
    document.getElementById("popupFileName").textContent=cleanName;

    // Album art
    let artworkURL = song.thumb || 'https://codehs.com/uploads/f111a37947de2cea81db858094c04f2d';
    document.getElementById('coverArt').src = artworkURL;
    if(document.getElementById('coverBackground')) document.getElementById('coverBackground').style.backgroundImage=`url("${artworkURL}")`;
    document.getElementById('playerPopup').style.backgroundImage=`url("${artworkURL}")`;
}

// --- PLAYBACK CONTROLS ---
function updateMediaButtons() {
    document.getElementById("popupPlay").textContent = audio.paused ? "▶" : "⏸";
    playPauseBtn.textContent = audio.paused ? "▶" : "||";
    document.getElementById("popupLoop").textContent = loopPlaylist?"🔁 On":"🔁 Off";
}

playPauseBtn.addEventListener('click', ()=>{ audio.paused?audio.play():audio.pause(); updateMediaButtons(); });
backBtn.addEventListener('click', ()=>{ if(audio.currentTime<10 && currentTrack>0) currentTrack--; loadTrack(currentTrack); audio.play(); updateMediaButtons(); });
forwardBtn.addEventListener('click', nextTrack);
loopBtn.addEventListener('click', ()=>{ loopPlaylist=!loopPlaylist; updateMediaButtons(); });

document.addEventListener("click", e=>{
    if(e.target.id==="popupPlay") audio.paused?audio.play():audio.pause(), updateMediaButtons();
    if(e.target.id==="popupNext") nextTrack();
    if(e.target.id==="popupBack") { if(audio.currentTime<10&&currentTrack>0) currentTrack--; loadTrack(currentTrack); audio.play(); updateMediaButtons(); }
    if(e.target.id==="popupLoop") loopPlaylist=!loopPlaylist, updateMediaButtons();
});

function nextTrack(){
    if(currentTrack<playlist.length-1) currentTrack++;
    else if(loopPlaylist) currentTrack=0;
    else return;
    loadTrack(currentTrack); audio.play(); updateMediaButtons();
}

// --- TIME UPDATE ---
audio.addEventListener('timeupdate', ()=>{
    const pct=(audio.currentTime/(audio.duration||1))*100;
    progressBar.style.width=pct+"%";
    timeDisplay.textContent=`${formatTime(audio.currentTime)} / ${formatTime(audio.duration||0)}`;
    const popupFill=document.getElementById("popupBarFill");
    const popupTime=document.getElementById("popupTime");
    if(popupFill) popupFill.style.width=pct+"%";
    if(popupTime) popupTime.textContent=`${formatTime(audio.currentTime)} / ${formatTime(audio.duration||0)}`;
});

progressContainer.addEventListener('click', e=>{
    const pct=(e.clientX - progressContainer.getBoundingClientRect().left)/progressContainer.clientWidth;
    audio.currentTime = pct*audio.duration;
});

// --- KEYBOARD ---
document.addEventListener('keydown', e=>{
    if(['INPUT','TEXTAREA'].includes(e.target.tagName)) return;
    if(e.code==='Space') e.preventDefault(), playPauseBtn.click();
});

// --- TIME FORMAT ---
function formatTime(sec=0){ const m=Math.floor(sec/60); const s=Math.floor(sec%60).toString().padStart(2,'0'); return `${m}:${s}`; }
