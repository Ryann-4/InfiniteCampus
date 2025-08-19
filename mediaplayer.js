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

// --- Load saved playlist from localStorage ---
window.addEventListener("DOMContentLoaded", () => {
    const saved = localStorage.getItem("savedPlaylist");
    if (saved) {
        const parsed = JSON.parse(saved);
        playlist = parsed.map(p => {
            const byteArray = Uint8Array.from(atob(p.data), c => c.charCodeAt(0));
            return new File([byteArray], p.name, { type: "audio/mp3" });
        });
        if (playlist.length) {
            currentTrack = 0;
            updatePlaylistUI();
            loadTrack(currentTrack);
            player.style.display = 'block';
        }
    }
});

// --- Save playlist to localStorage ---
function savePlaylist() {
    const serialized = playlist.map(file => {
        return new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve({
                    name: file.name,
                    data: reader.result.split(',')[1]
                });
            };
            reader.readAsDataURL(file);
        });
    });
    Promise.all(serialized).then(results => {
        localStorage.setItem("savedPlaylist", JSON.stringify(results));
    });
}

// --- Media Session (for system controls) ---
if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play',  () => { audio.play();  playPauseBtn.textContent = '||'; });
    navigator.mediaSession.setActionHandler('pause', () => { audio.pause(); playPauseBtn.textContent = '▶'; });
    navigator.mediaSession.setActionHandler('previoustrack', () => backBtn.click());
    navigator.mediaSession.setActionHandler('nexttrack',     () => forwardBtn.click());
}

// --- File Upload Handler ---
fileInput.addEventListener('change', () => {
    const files = Array.from(fileInput.files).slice(0, 20);
    if (!files.length) return;
    playlist     = files;
    currentTrack = 0;
    updatePlaylistUI();
    loadTrack(currentTrack);
    savePlaylist();
    player.style.display = 'block';
});

// --- Playlist UI ---
function updatePlaylistUI() {
    playlistElement.innerHTML = '';
    playlist.forEach((file, index) => {
        const li = document.createElement('li');
        li.className = index === currentTrack ? 'active' : '';
        li.classList.add('playlist-item');
        li.dataset.index = index;
        li.draggable = true;

        const nameSpan = document.createElement('span');
        nameSpan.classList.add('txt');
        nameSpan.textContent = `${index + 1}. ${file.name.replace(/\.mp3$/i, '')}`;

        const durationSpan = document.createElement('span');
        durationSpan.classList.add('duration');

        const audioTemp = document.createElement('audio');
        audioTemp.src = URL.createObjectURL(file);
        audioTemp.addEventListener('loadedmetadata', () => {
            const mins = Math.floor(audioTemp.duration / 60);
            const secs = Math.floor(audioTemp.duration % 60).toString().padStart(2, '0');
            durationSpan.textContent = `${mins}:${secs}`;
        });

        li.append(nameSpan, durationSpan);
        li.addEventListener('click', () => {
            currentTrack = index;
            loadTrack(currentTrack);
            audio.play();
            playPauseBtn.textContent = '||';
        });

        li.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', index);
            li.classList.add('dragging');
        });
        li.addEventListener('dragover', e => { e.preventDefault(); li.classList.add('drag-over'); });
        li.addEventListener('dragleave', () => li.classList.remove('drag-over'));
        li.addEventListener('drop', e => {
            e.preventDefault();
            li.classList.remove('drag-over');
            const from = +e.dataTransfer.getData('text/plain');
            const to   = +li.dataset.index;
            if (from === to) return;
            const [moved] = playlist.splice(from, 1);
            playlist.splice(to, 0, moved);
            if      (currentTrack === from) currentTrack = to;
            else if (from < currentTrack && to >= currentTrack)   currentTrack--;
            else if (from > currentTrack && to <= currentTrack)   currentTrack++;
            updatePlaylistUI();
            savePlaylist();
        });
        li.addEventListener('dragend', () => li.classList.remove('dragging'));
        playlistElement.appendChild(li);
    });
}

// --- Popup Creation ---
function createPopup() {
    if (document.getElementById("playerPopup")) return;
    const popup = document.createElement("div");
    popup.id = "playerPopup";
    popup.innerHTML = `
        <div class="popup-header" id="popupFileName"></div>
        <div class="popup-controls">
            <button id="popupBack">⏮</button>
            <button id="popupPlay">▶</button>
            <button id="popupNext">⏭</button>
            <button id="popupLoop">🔁 Off</button>
        </div>
        <div class="popup-bar"><div id="popupBarFill"></div></div>
        <div id="popupTime">0:00 / 0:00</div>
    `;
    document.body.appendChild(popup);

    Object.assign(popup.style, {
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
        zIndex: "9999"
    });
    document.getElementById("popupBarFill").style.height = "6px";
    document.getElementById("popupBarFill").style.background = "lime";
}

// --- Load Track ---
async function loadTrack(index) {
    createPopup();
    const file = playlist[index];
    if (!file) return;

    const url = URL.createObjectURL(file);
    audio.src = url;
    audio.load();

    const cleanName = file.name.replace(/\.mp3$/i, '');
    filenameDisplay.innerHTML = `<span style="text-align:center"> ${cleanName}<br><br></span>`;
    document.getElementById("popupFileName").textContent = cleanName;

    playPauseBtn.textContent = '▶';
    progressBar.style.width = '0%';
    timeDisplay.textContent = '0:00 / 0:00';

    updatePlaylistUI();

    // Album Art
    const albumArt = document.getElementById('albumArt');
    let artworkURL = 'https://codehs.com/uploads/f111a37947de2cea81db858094c04f2d';
    try {
        const mm = await import('https://cdn.jsdelivr.net/npm/music-metadata@10.8.3/+esm');
        const { common } = await mm.parseBlob(file);
        if (common.picture?.length) {
            const picture = common.picture[0];
            const base64String = btoa(String.fromCharCode(...new Uint8Array(picture.data)));
            artworkURL = `data:${picture.format};base64,${base64String}`;
        }
    } catch {}

    albumArt.src = artworkURL;
    document.getElementById('coverBackground').style.backgroundImage = `url("${artworkURL}")`;
    document.getElementById('playerPopup').style.backgroundImage = `url("${artworkURL}")`;

    updateMediaSession(cleanName, artworkURL);
}

// --- Media Session Metadata ---
function updateMediaSession(title, artworkURL) {
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title,
            artist: '',
            album: '',
            artwork: [
                { src: artworkURL, sizes: '512x512', type: 'image/png' }
            ]
        });
    }
}

// --- Player Controls ---
playPauseBtn.addEventListener('click', async () => {
    if (audio.paused) {
        await audio.play();
        playPauseBtn.textContent = '||';
        const file = playlist[currentTrack];
        updateMediaSession(file.name.replace(/\.mp3$/i, ''), document.getElementById('albumArt').src);
        document.getElementById("popupPlay").textContent = "⏸";
    } else {
        audio.pause();
        playPauseBtn.textContent = '▶';
        document.getElementById("popupPlay").textContent = "▶";
    }
});

forwardBtn.addEventListener('click', nextTrack);
backBtn.addEventListener('click', () => {
    if (audio.currentTime < 10 && currentTrack > 0) currentTrack--;
    loadTrack(currentTrack);
    audio.play();
    playPauseBtn.textContent = '||';
    document.getElementById("popupPlay").textContent = "⏸";
});

loopBtn.addEventListener('click', () => {
    loopPlaylist = !loopPlaylist;
    loopBtn.textContent = loopPlaylist ? '↺ On' : '↺ Off';
    document.getElementById("popupLoop").textContent = loopPlaylist ? "🔁 On" : "🔁 Off";
});

audio.addEventListener('ended', nextTrack);
function nextTrack() {
    if (currentTrack < playlist.length - 1) currentTrack++;
    else if (loopPlaylist) currentTrack = 0;
    else return;
    loadTrack(currentTrack);
    audio.play();
    playPauseBtn.textContent = '||';
    document.getElementById("popupPlay").textContent = "⏸";
}

// --- Popup Button Events ---
document.addEventListener("click", e => {
    if (e.target.id === "popupPlay") {
        if (audio.paused) {
            audio.play();
            e.target.textContent = "⏸";
            playPauseBtn.textContent = "||";
        } else {
            audio.pause();
            e.target.textContent = "▶";
            playPauseBtn.textContent = "▶";
        }
    }
    if (e.target.id === "popupNext") nextTrack();
    if (e.target.id === "popupBack") {
        if (audio.currentTime < 10 && currentTrack > 0) currentTrack--;
        loadTrack(currentTrack);
        audio.play();
        document.getElementById("popupPlay").textContent = "⏸";
        playPauseBtn.textContent = "||";
    }
    if (e.target.id === "popupLoop") {
        loopPlaylist = !loopPlaylist;
        e.target.textContent = loopPlaylist ? "🔁 On" : "🔁 Off";
        loopBtn.textContent   = loopPlaylist ? "↺ On" : "↺ Off";
    }
});

// --- Progress ---
audio.addEventListener('timeupdate', () => {
    const pct = (audio.currentTime / (audio.duration || 1)) * 100;
    progressBar.style.width = `${pct}%`;
    timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration || 0)}`;

    const popupFill = document.getElementById("popupBarFill");
    const popupTime = document.getElementById("popupTime");
    if (popupFill) popupFill.style.width = pct + "%";
    if (popupTime) popupTime.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration || 0)}`;
});

// --- Seek ---
progressContainer.addEventListener('click', e => {
    const pct = (e.clientX - progressContainer.getBoundingClientRect().left) / progressContainer.clientWidth;
    audio.currentTime = pct * audio.duration;
});

// --- Keyboard ---
document.addEventListener('keydown', e => {
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
    if (e.code === 'Space') {
        e.preventDefault();
        playPauseBtn.click();
    }
});

// --- Helpers ---
function formatTime(sec=0) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}