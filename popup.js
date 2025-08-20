let playlist = [];
let audio = new Audio();
let currentTrack = 0;
let loopPlaylist = false;
audio.controls = true; // this adds the browser's default play/pause/skip UI
document.body.appendChild(audio); // optional: add to DOM if you want it visible
let popup, progressFill, titleElem, playBtn, loopBtn;
function initPopup() {
    if (document.getElementById("playerPopup")) return;
    popup = document.createElement("div");
    popup.id = "playerPopup";
    const bgOverlay = document.createElement("div");
    bgOverlay.id = "popupBgOverlay";
    Object.assign(bgOverlay.style, {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "blur(2px)",
        zIndex: "0",
        borderRadius: "12px"
    });
    popup.appendChild(bgOverlay);
    const content = document.createElement("div");
    content.id = "popupContent";
    content.innerHTML = `
        <div style="display:flex; border-radius:inherit; justify-content:space-between; align-items:center; cursor:move; padding:4px 8px; background:rgba(0,0,0,0.5); z-index:1; position:relative;">
            <span id="popupTitle"></span>
            <button id="closePopup" class="closepopup">X</button>
        </div>
        <div style="text-align:center; margin:10px 0; z-index:1; position:relative;">
            <button id="popupBack" class="mediabtns">⏮</button>
            <button id="popupPlay" class="mediabtns">▶</button>
            <button id="popupNext" class="mediabtns">⏭</button>
            <button id="popupLoop" class="mediabtns">↺ Off</button>
        </div>
        <div style="width:90%; height:6px; background:#333; margin:10px auto; border-radius:3px; position:relative; z-index:1;">
            <div id="popupBarFill" style="height:100%; width:0%; background:lime; border-radius:3px;"></div>
        </div>
        <div id="popupTime" style="background-color:black; text-align:center; margin-bottom:10px; position:relative; z-index:1;">0:00 / 0:00</div>
    `;
    popup.appendChild(content);
    Object.assign(popup.style, {
        position: "fixed",
        top: "20px",
        right: "20px",
        width: "280px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
        color: "white",
        overflow: "hidden",
        zIndex: 9999,
        userSelect: "none"
    });
    document.body.appendChild(popup);
    progressFill = document.getElementById("popupBarFill");
    titleElem = document.getElementById("popupTitle");
    playBtn = document.getElementById("popupPlay");
    loopBtn = document.getElementById("popupLoop");
    popup.bgOverlay = bgOverlay;
    let isDragging = false, offsetX, offsetY;
    const header = document.querySelector("#popupContent > div:first-child");
    header.addEventListener("mousedown", e => {
        isDragging = true;
        offsetX = e.clientX - popup.getBoundingClientRect().left;
        offsetY = e.clientY - popup.getBoundingClientRect().top;
    });
    window.addEventListener("mousemove", e => {
        if (isDragging) {
            popup.style.left = (e.clientX - offsetX) + "px";
            popup.style.top  = (e.clientY - offsetY) + "px";
        }
    });
    window.addEventListener("mouseup", () => isDragging = false);
    document.getElementById("closePopup").addEventListener("click", () => {
        audio.pause();
        popup.remove();
    });
    playBtn.addEventListener("click", togglePlay);
    document.getElementById("popupNext").addEventListener("click", nextTrack);
    document.getElementById("popupBack").addEventListener("click", () => {
        if (audio.currentTime < 10 && currentTrack > 0) currentTrack--;
        loadTrack(currentTrack);
        audio.play();
        updatePlayButton();
    });
    loopBtn.addEventListener("click", () => {
        loopPlaylist = !loopPlaylist;
        loopBtn.textContent = loopPlaylist ? "↺ On" : "↺ Off";
    });
    audio.addEventListener("timeupdate", () => {
        const pct = (audio.currentTime / (audio.duration || 1)) * 100;
        progressFill.style.width = pct + "%";
        document.getElementById("popupTime").textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration||0)}`;
    });
    progressFill.parentElement.addEventListener("click", e => {
        const pct = (e.clientX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.clientWidth;
        audio.currentTime = pct * audio.duration;
    });
}
function formatTime(sec=0){
    const m = Math.floor(sec/60);
    const s = Math.floor(sec%60).toString().padStart(2,"0");
    return `${m}:${s}`;
}
function loadPlaylistFromDB() {
    const request = indexedDB.open("MusicDB", 1);
    request.onsuccess = e => {
        const db = e.target.result;
        const transaction = db.transaction("songs", "readonly");
        const store = transaction.objectStore("songs");
        const getAll = store.getAll();
        getAll.onsuccess = e => {
            playlist = e.target.result.map(item => {
                const byteArray = new Uint8Array(item.data);
                const file = new File([byteArray], item.name, { type: "audio/mp3" });
                file.thumbnail = item.thumbnail || "";
                return file;
            });
            if (playlist.length) {
                initPopup();
                loadTrack(currentTrack);
            }
        };
    };
}
async function loadTrack(index) {
    const file = playlist[index];
    if (!file) return;
    audio.src = URL.createObjectURL(file);
    audio.load();
    const title = file.name.replace(/\.mp3$/i,"");
    titleElem.textContent = title;
    if (popup.bgOverlay) {
        if (file.thumbnail) {
            popup.bgOverlay.style.backgroundImage = `url(${file.thumbnail})`;
        } else {
            popup.bgOverlay.style.backgroundImage = "";
        }
    }
    updatePlayButton();
}
function togglePlay() {
    if (audio.paused) { audio.play(); } 
    else { audio.pause(); }
    updatePlayButton();
}
function updatePlayButton() {
    playBtn.textContent = audio.paused ? "▶" : "⏸";
}
function nextTrack() {
    if (currentTrack < playlist.length - 1) currentTrack++;
    else if (loopPlaylist) currentTrack = 0;
    else return;
    loadTrack(currentTrack);
    audio.play();
    updatePlayButton();
}
audio.addEventListener('ended', () => {
    if (currentTrack < playlist.length - 1) {
        currentTrack++;
        loadTrack(currentTrack);
        audio.play();
        playBtn.textContent = "⏸";
    } 
    else if (loopPlaylist) {
        currentTrack = 0;
        loadTrack(currentTrack);
        audio.play();
        playBtn.textContent = "⏸";
    } 
    else {
        audio.pause();
        playBtn.textContent = "▶";
    }
});
loadPlaylistFromDB();