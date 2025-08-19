// --- IndexedDB Setup ---
const dbName = "dryPlayerDB";
const dbVersion = 1;
let db;

const request = indexedDB.open(dbName, dbVersion);

request.onupgradeneeded = e => {
    db = e.target.result;
    if (!db.objectStoreNames.contains("songs")) {
        const store = db.createObjectStore("songs", { keyPath: "id", autoIncrement: true });
        store.createIndex("name", "name", { unique: false });
    }
};

request.onsuccess = e => {
    db = e.target.result;
    loadPlaylistFromDB();
};

request.onerror = e => console.error("DB Error:", e.target.error);

// --- Playlist & Player Variables ---
let playlist = [];
let currentTrack = 0;
let loopPlaylist = false;

const audio = document.createElement("audio");
audio.id = "audio";
document.body.appendChild(audio);

let playerPopup;

// --- IndexedDB Functions ---
function addSongToDB(name, file, thumbnail) {
    const reader = new FileReader();
    reader.onload = () => {
        const songData = {
            name,
            fileData: reader.result,
            thumbnail: thumbnail || "https://codehs.com/uploads/f111a37947de2cea81db858094c04f2d"
        };

        const transaction = db.transaction("songs", "readwrite");
        const store = transaction.objectStore("songs");
        store.add(songData);

        transaction.oncomplete = () => {
            console.log("Song added:", name);
            loadPlaylistFromDB();
            location.reload(); // reload after upload
        };
        transaction.onerror = e => console.error("DB Insert Error:", e.target.error);
    };
    reader.readAsArrayBuffer(file);
}

function loadPlaylistFromDB() {
    const transaction = db.transaction("songs", "readonly");
    const store = transaction.objectStore("songs");

    const request = store.getAll();
    request.onsuccess = e => {
        playlist = e.target.result.slice(0, 20);
        if (playlist.length) {
            currentTrack = 0;
            loadTrack(currentTrack);
            renderPlaylistUI();
        }
    };
}

// --- Reset Playlist Order ---
function resetPlaylistOrder(newSongs) {
    const tx = db.transaction("songs", "readwrite");
    const store = tx.objectStore("songs");
    store.clear();
    tx.oncomplete = () => {
        const tx2 = db.transaction("songs", "readwrite");
        const store2 = tx2.objectStore("songs");
        newSongs.forEach(song => store2.add(song));
        tx2.oncomplete = () => {
            console.log("Playlist reordered and saved.");
            loadPlaylistFromDB();
        };
    };
}

// --- Playlist UI + Drag Reorder ---
function renderPlaylistUI() {
    let list = document.getElementById("playlistUI");
    if (!list) {
        list = document.createElement("ul");
        list.id = "playlistUI";
        Object.assign(list.style, {
            maxHeight: "200px",
            overflowY: "auto",
            marginTop: "8px",
            padding: "0",
            listStyle: "none",
            fontSize: "14px",
            color: "white"
        });
        playerPopup.appendChild(list);
    }
    list.innerHTML = "";

    playlist.forEach((song, i) => {
        const li = document.createElement("li");
        li.textContent = song.name;
        li.dataset.index = i;
        li.draggable = true;
        li.style.padding = "4px";
        li.style.borderBottom = "1px solid rgba(255,255,255,0.2)";
        list.appendChild(li);
    });

    enableReorder(list, playlist);

    // --- Submit Button ---
    let submitBtn = document.getElementById("playlistSubmit");
    if (!submitBtn) {
        submitBtn = document.createElement("button");
        submitBtn.id = "playlistSubmit";
        submitBtn.textContent = "Submit Playlist";
        Object.assign(submitBtn.style, {
            marginTop: "6px",
            padding: "4px 8px",
            cursor: "pointer",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#0f0",
            color: "#000",
            fontWeight: "bold"
        });
        playerPopup.appendChild(submitBtn);

        submitBtn.addEventListener("click", () => {
            const newOrder = [...list.querySelectorAll("li")].map(li => playlist[li.dataset.index]);
            resetPlaylistOrder(newOrder);
            alert("Playlist order saved!");
        });
    }
}

function enableReorder(list, songs) {
    let dragSrcEl = null;

    list.addEventListener("dragstart", e => {
        if (e.target.tagName === "LI") {
            dragSrcEl = e.target;
            e.dataTransfer.effectAllowed = "move";
        }
    });

    list.addEventListener("dragover", e => {
        e.preventDefault();
        if (e.target.tagName === "LI") e.target.style.borderTop = "2px solid #0f0";
    });

    list.addEventListener("dragleave", e => {
        if (e.target.tagName === "LI") e.target.style.borderTop = "";
    });

    list.addEventListener("drop", e => {
        e.preventDefault();
        if (e.target.tagName === "LI" && dragSrcEl !== e.target) {
            e.target.style.borderTop = "";

            const items = [...list.querySelectorAll("li")];
            const oldIndex = items.indexOf(dragSrcEl);
            const newIndex = items.indexOf(e.target);

            if (oldIndex < newIndex) {
                list.insertBefore(dragSrcEl, e.target.nextSibling);
            } else {
                list.insertBefore(dragSrcEl, e.target);
            }
        }
    });
}

// --- Remaining popup, track loader, playback controls, progress bar, and addDrySong functions remain unchanged ---

// --- Popup Creation ---
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
        zIndex: "9999"
    });

    document.getElementById("popupBarFill").style.height = "6px";
    document.getElementById("popupBarFill").style.background = "lime";

    // Dragging
    const header = document.getElementById("popupHeader");
    let offsetX = 0, offsetY = 0, isDown = false;
    header.addEventListener("mousedown", e => {
        isDown = true;
        offsetX = e.clientX - playerPopup.offsetLeft;
        offsetY = e.clientY - playerPopup.offsetTop;
    });
    document.addEventListener("mouseup", () => isDown = false);
    document.addEventListener("mousemove", e => {
        if (!isDown) return;
        playerPopup.style.left = e.clientX - offsetX + "px";
        playerPopup.style.top = e.clientY - offsetY + "px";
    });

    // Close Button
    document.getElementById("popupClose").addEventListener("click", () => {
        audio.pause();
        audio.src = "";
        playerPopup.remove();
        playerPopup = null;
    });

    // Controls
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

// --- Track Loader ---
async function loadTrack(index) {
    createPopup();
    const track = playlist[index];
    if (!track) return;

    const blob = new Blob([track.fileData], { type: "audio/mp3" });
    const url = URL.createObjectURL(blob);
    audio.src = url;
    audio.load();

    const cleanName = track.name.replace(/\.mp3$/i, '');
    document.getElementById("popupFileName").textContent = cleanName;

    let artworkURL = track.thumbnail || "https://codehs.com/uploads/f111a37947de2cea81db858094c04f2d";
    document.getElementById("playerPopup").style.backgroundImage = `url("${artworkURL}")`;

    updateMediaSession(cleanName, artworkURL);
}

// --- Media Session Metadata ---
function updateMediaSession(title, artworkURL) {
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title,
            artist: '',
            album: '',
            artwork: [{ src: artworkURL, sizes: '512x512', type: 'image/png' }]
        });
    }
}

// --- Playback Controls ---
function togglePlay() {
    const btn = document.getElementById("popupPlay");
    if (audio.paused) {
        audio.play();
        btn.textContent = "⏸";
    } else {
        audio.pause();
        btn.textContent = "▶";
    }
}

function nextTrack() {
    if (currentTrack < playlist.length - 1) currentTrack++;
    else if (loopPlaylist) currentTrack = 0;
    else return;
    loadTrack(currentTrack);
    audio.play();
    document.getElementById("popupPlay").textContent = "⏸";
}

// --- Progress Bar ---
audio.addEventListener("timeupdate", () => {
    const pct = (audio.currentTime / (audio.duration || 1)) * 100;
    const bar = document.getElementById("popupBarFill");
    if (bar) bar.style.width = pct + "%";
    const time = document.getElementById("popupTime");
    if (time) time.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration || 0)}`;
});

function formatTime(sec=0) {
    const m = Math.floor(sec/60);
    const s = Math.floor(sec%60).toString().padStart(2,"0");
    return `${m}:${s}`;
}

// --- Adding a New Song ---
async function addDrySong(name, file, thumbnail) {
    let thumbURL = thumbnail;

    try {
        const mm = await import('https://cdn.jsdelivr.net/npm/music-metadata@10.8.3/+esm');
        const { common } = await mm.parseBlob(file);
        if (common.picture?.length) {
            const picture = common.picture[0];
            const base64String = btoa(String.fromCharCode(...new Uint8Array(picture.data)));
            thumbURL = `data:${picture.format};base64,${base64String}`;
        }
    } catch (e) {
        console.warn("Thumbnail extract failed:", e);
    }

    const fileBuffer = await file.arrayBuffer();
    const transaction = db.transaction("songs", "readwrite");
    const store = transaction.objectStore("songs");
    store.add({ name, fileData: fileBuffer, thumbnail: thumbURL || null });

    transaction.oncomplete = () => {
        console.log("Song added:", name);
        loadPlaylistFromDB();
    };
    transaction.onerror = e => console.error("DB Insert Error:", e.target.error);
    location.reload();
}
