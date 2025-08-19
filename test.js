const fileInput       = document.getElementById('fileInput');
const audio           = document.getElementById('audio');
const playPauseBtn    = document.getElementById('playPauseBtn');
const backBtn         = document.getElementById('backBtn');
const forwardBtn      = document.getElementById('forwardBtn');
const loopBtn         = document.getElementById('loopBtn');
const progressContainer = document.getElementById('progressContainer');
const progressBar     = document.getElementById('progressBar');
const timeDisplay     = document.getElementById('timeDisplay');
const playlistElement = document.getElementById('playlist');
const albumArt        = document.getElementById('albumArt');
const clearBtn        = document.getElementById('clearBtn');
let playlist = [];
let currentTrack = 0;
let loopPlaylist = false;
let db;
const request = indexedDB.open("MusicDB", 1);
request.onupgradeneeded = e => {
    db = e.target.result;
    if (!db.objectStoreNames.contains("songs")) {
        db.createObjectStore("songs", { keyPath: "id", autoIncrement: true });
    }
};
request.onsuccess = e => {
    db = e.target.result;
    loadPlaylistFromDB();
};
function loadPlaylistFromDB() {
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
            updatePlaylistUI();
            loadTrack(currentTrack);
        }
    };
}
function saveSongToDB(file, thumbnail) {
    const reader = new FileReader();
    reader.onload = () => {
        const data = new Uint8Array(reader.result);
        const transaction = db.transaction("songs", "readwrite");
        const store = transaction.objectStore("songs");
        store.add({ name: file.name, data: data, thumbnail: thumbnail });
    };
    reader.readAsArrayBuffer(file);
}
clearBtn.addEventListener("click", () => {
    const transaction = db.transaction("songs", "readwrite");
    const store = transaction.objectStore("songs");
    store.clear();
    playlist = [];
    updatePlaylistUI();
    audio.pause();
    audio.src = "";
    albumArt.src = "";
});
fileInput.addEventListener("change", async () => {
    const files = Array.from(fileInput.files).slice(0, 20 - playlist.length);
    for (const file of files) {
        let thumbnail = await extractThumbnail(file);
        playlist.push(file);
        saveSongToDB(file, thumbnail);
    }
    updatePlaylistUI();
    if (playlist.length && !audio.src) loadTrack(0);
});
async function extractThumbnail(file) {
    try {
        const mm = await import('https://cdn.jsdelivr.net/npm/music-metadata@10.8.3/+esm');
        const { common } = await mm.parseBlob(file);
        if (common.picture?.length) {
            const pic = common.picture[0];
            const base64String = btoa(String.fromCharCode(...new Uint8Array(pic.data)));
            return `data:${pic.format};base64,${base64String}`;
        }
    } catch(e) { console.warn("No thumbnail:", e.message); }
    return "";
}
function updatePlaylistUI() {
    playlistElement.innerHTML = '';
    playlist.forEach((file, index) => {
        const li = document.createElement("li");
        li.className = "playlist-item" + (index === currentTrack ? " active" : "");
        li.dataset.index = index;
        li.draggable = true;
        const img = document.createElement("img");
        img.src = file.thumbnail || "https://codehs.com/uploads/f111a37947de2cea81db858094c04f2d";
        const span = document.createElement("span");
        span.textContent = file.name.replace(/\.mp3$/i,"");
        li.appendChild(img);
        li.appendChild(span);
        li.addEventListener("click", () => {
            currentTrack = index;
            loadTrack(currentTrack);
            audio.play();
            playPauseBtn.textContent = "||";
        });
        li.addEventListener("dragstart", e => {
            e.dataTransfer.setData("text/plain", index);
        });
        li.addEventListener("dragover", e => {
            e.preventDefault();
            li.style.borderTop = "2px solid #00f"; // highlight drop area
        });
        li.addEventListener("dragleave", () => {
            li.style.borderTop = "";
        });
        li.addEventListener("drop", e => {
            e.preventDefault();
            li.style.borderTop = "";
            const fromIndex = parseInt(e.dataTransfer.getData("text/plain"));
            const toIndex = index;
            reorderPlaylist(fromIndex, toIndex);
        });
        playlistElement.appendChild(li);
    });
}
function reorderPlaylist(fromIndex, toIndex) {
    if (fromIndex === toIndex) return;
    const moved = playlist.splice(fromIndex, 1)[0];
    playlist.splice(toIndex, 0, moved);
    updatePlaylistUI();
    savePlaylistOrderToDB();
}
function savePlaylistOrderToDB() {
    const transaction = db.transaction("songs", "readwrite");
    const store = transaction.objectStore("songs");
    store.clear();
    playlist.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
            const data = new Uint8Array(reader.result);
            store.add({ name: file.name, data: data, thumbnail: file.thumbnail || "" });
        };
        reader.readAsArrayBuffer(file);
    });
}
async function loadTrack(index) {
    const file = playlist[index];
    if (!file) return;
    audio.src = URL.createObjectURL(file);
    audio.load();
    albumArt.src = file.thumbnail || "https://codehs.com/uploads/f111a37947de2cea81db858094c04f2d";
    updatePlaylistUI();
}
playPauseBtn.addEventListener("click", () => {
    if (audio.paused) { audio.play(); playPauseBtn.textContent = "||"; }
    else { audio.pause(); playPauseBtn.textContent = "▶"; }
});
forwardBtn.addEventListener("click", nextTrack);
backBtn.addEventListener("click", () => {
    if (audio.currentTime < 10 && currentTrack > 0) currentTrack--;
    loadTrack(currentTrack);
    audio.play();
    playPauseBtn.textContent = "||";
});
loopBtn.addEventListener("click", () => {
    loopPlaylist = !loopPlaylist;
    loopBtn.textContent = loopPlaylist ? "↺ On" : "↺ Off";
});
audio.addEventListener("ended", nextTrack);
function nextTrack() {
    if (currentTrack < playlist.length - 1) currentTrack++;
    else if (loopPlaylist) currentTrack = 0;
    else return;
    loadTrack(currentTrack);
    audio.play();
    playPauseBtn.textContent = "||";
}
audio.addEventListener("timeupdate", () => {
    const pct = (audio.currentTime / (audio.duration || 1)) * 100;
    progressBar.style.width = pct + "%";
    timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration || 0)}`;
});
progressContainer.addEventListener("click", e => {
    const pct = (e.clientX - progressContainer.getBoundingClientRect().left) / progressContainer.clientWidth;
    audio.currentTime = pct * audio.duration;
});
document.addEventListener("keydown", e => {
    if (['INPUT','TEXTAREA'].includes(e.target.tagName)) return;
    if (e.code === "Space") { e.preventDefault(); playPauseBtn.click(); }
});
function formatTime(sec=0){
    const m = Math.floor(sec/60);
    const s = Math.floor(sec%60).toString().padStart(2,'0');
    return `${m}:${s}`;
}