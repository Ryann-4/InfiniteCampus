// --- IndexedDB Setup ---
const dbName = "dryPlayerDB";
const dbVersion = 1;
let db;
let playlist = [];
let currentTrack = 0;
let loopPlaylist = false;
let playerPopup;
const audio = document.createElement("audio");
document.body.appendChild(audio);

// --- Open DB ---
const request = indexedDB.open(dbName, dbVersion);
request.onsuccess = e => {
    db = e.target.result;
    loadPlaylistFromDB();
};
request.onerror = e => console.error("DB Error:", e.target.error);

// --- Load Songs from DB ---
function loadPlaylistFromDB() {
    const transaction = db.transaction("songs", "readonly");
    const store = transaction.objectStore("songs");
    const req = store.getAll();
    req.onsuccess = e => {
        playlist = e.target.result.slice(0, 20);
        if (playlist.length) loadTrack(currentTrack);
    };
}

// --- Popup Creation & Drag ---
function createPopup() {
    if (playerPopup) return;

    playerPopup = document.createElement("div");
    playerPopup.id = "playerPopup";
    playerPopup.innerHTML = `
        <div class="popup-header" id="popupHeader">
            <span id="popupFileName"></span>
            <button id="popupClose">✖</button>
        </div>
        <div class="popup-controls">
            <button id="popupBack" class="mediabtns">⏮</button>
            <button id="popupPlay" class="mediabtns">▶</button>
            <button id="popupNext" class="mediabtns">⏭</button>
            <button id="popupLoop" class="mediabtns">🔁 Off</button>
        </div>
        <div class="popup-bar"><div id="popupBarFill"></div></div>
        <div id="popupTime">0:00 / 0:00</div>
    `;
    document.body.appendChild(playerPopup);
    Object.assign(playerPopup.style, {
        position: "fixed",
        top: "20px",
        right: "20px",
        width: "280px",
        padding: "12px",
        color: "white",
        borderRadius: "12px",
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
        fontFamily: "sans-serif",
        zIndex: "9999",
        cursor: "move"
    });

    document.getElementById("popupBarFill").style.height = "6px";
    document.getElementById("popupBarFill").style.background = "lime";

    // Drag
    const header = document.getElementById("popupHeader");
    let offsetX = 0, offsetY = 0, isDown = false;
    header.addEventListener("mousedown", e => { isDown = true; offsetX = e.clientX - playerPopup.offsetLeft; offsetY = e.clientY - playerPopup.offsetTop; });
    document.addEventListener("mouseup", () => isDown = false);
    document.addEventListener("mousemove", e => {
        if (!isDown) return;
        playerPopup.style.left = e.clientX - offsetX + "px";
        playerPopup.style.top = e.clientY - offsetY + "px";
    });

    // Close
    document.getElementById("popupClose").addEventListener("click", () => {
        audio.pause();
        audio.src = "";
        playerPopup.remove();
        playerPopup = null;
    });

    // Buttons
    document.getElementById("popupPlay").addEventListener("click", togglePlay);
    document.getElementById("popupNext").addEventListener("click", nextTrack);
    document.getElementById("popupBack").addEventListener("click", () => {
        if (audio.currentTime < 10 && currentTrack > 0) currentTrack--;
        loadTrack(currentTrack);
        audio.play();
        document.getElementById("popupPlay").textContent = "⏸";
    });
    document.getElementById("popupLoop").addEventListener("click", () => {
        loopPlaylist = !loopPlaylist;
        document.getElementById("popupLoop").textContent = loopPlaylist ? "🔁 On" : "🔁 Off";
    });
}

// --- Load Track ---
function loadTrack(index) {
    createPopup();
    const track = playlist[index];
    if (!track) return;
    const blob = new Blob([track.fileData], { type: "audio/mp3" });
    const url = URL.createObjectURL(blob);
    audio.src = url;
    audio.load();

    document.getElementById("popupFileName").textContent = track.name.replace(/\.mp3$/i,'');
    playerPopup.style.backgroundImage = `url("${track.thumbnail || 'https://codehs.com/uploads/f111a37947de2cea81db858094c04f2d'}")`;
    updateMediaSession(track.name, track.thumbnail);
}

// --- Controls ---
function togglePlay() {
    const btn = document.getElementById("popupPlay");
    if (audio.paused) { audio.play(); btn.textContent="⏸"; }
    else { audio.pause(); btn.textContent="▶"; }
}

function nextTrack() {
    if(currentTrack<playlist.length-1) currentTrack++;
    else if(loopPlaylist) currentTrack=0;
    else return;
    loadTrack(currentTrack);
    audio.play();
    document.getElementById("popupPlay").textContent="⏸";
}

// --- Media Session ---
function updateMediaSession(title, artworkURL){
    if('mediaSession' in navigator){
        navigator.mediaSession.metadata=new MediaMetadata({ title, artist:'', album:'', artwork:[{src:artworkURL,sizes:'512x512',type:'image/png'}] });
    }
}

// --- Progress ---
audio.addEventListener("timeupdate",()=>{
    const pct = audio.currentTime/(audio.duration||1)*100;
    const bar=document.getElementById("popupBarFill");
    if(bar) bar.style.width=pct+"%";
    const time=document.getElementById("popupTime");
    if(time) time.textContent=`${formatTime(audio.currentTime)} / ${formatTime(audio.duration||0)}`;
});

function formatTime(sec=0){ const m=Math.floor(sec/60); const s=Math.floor(sec%60).toString().padStart(2,'0'); return `${m}:${s}`; }
