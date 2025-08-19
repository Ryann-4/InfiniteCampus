(function () {
    if (document.getElementById("dry-music-popup")) return;

    const maxSongs = 20;
    let db;
    let playlist = [];
    let currentTrack = 0;
    let loopPlaylist = false;

    // Open IndexedDB
    const request = indexedDB.open("DryMusicDB", 1);
    request.onupgradeneeded = function (e) {
        db = e.target.result;
        db.createObjectStore("songs", { keyPath: "id", autoIncrement: true });
    };
    request.onsuccess = function (e) {
        db = e.target.result;
        loadPlaylistFromDB();
    };
    request.onerror = function (e) {
        console.error("IndexedDB open error:", e);
    };

    // Create popup
    const popup = document.createElement("div");
    popup.id = "dry-music-popup";
    Object.assign(popup.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "300px",
        height: "120px",
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        cursor: "move",
        zIndex: "9999",
        backgroundSize: "cover",
        backgroundPosition: "center"
    });
    document.body.appendChild(popup);

    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "✖";
    Object.assign(closeBtn.style, {
        position: "absolute",
        top: "5px",
        right: "5px",
        border: "none",
        background: "rgba(0,0,0,0.6)",
        color: "white",
        borderRadius: "50%",
        width: "24px",
        height: "24px",
        cursor: "pointer"
    });
    popup.appendChild(closeBtn);

    const title = document.createElement("div");
    title.style.fontSize = "14px";
    title.style.fontWeight = "bold";
    title.style.marginTop = "10px";
    popup.appendChild(title);

    const audio = document.createElement("audio");
    audio.style.display = "none";
    popup.appendChild(audio);

    // Controls
    const controls = document.createElement("div");
    Object.assign(controls.style, {
        marginTop: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "90%"
    });
    popup.appendChild(controls);

    const backBtn = document.createElement("button");
    backBtn.className = "mediabtns";
    backBtn.textContent = "|◁";
    const playPauseBtn = document.createElement("button");
    playPauseBtn.className = "mediabtns";
    playPauseBtn.textContent = "▶️";
    const forwardBtn = document.createElement("button");
    forwardBtn.className = "mediabtns";
    forwardBtn.textContent = "▷|";
    const loopBtn = document.createElement("button");
    loopBtn.className = "mediabtns";
    loopBtn.textContent = "↺ Off";

    const progressContainer = document.createElement("div");
    Object.assign(progressContainer.style, {
        flex: "1",
        height: "6px",
        background: "rgba(255,255,255,0.3)",
        margin: "0 10px",
        borderRadius: "3px",
        position: "relative"
    });
    const progressBar = document.createElement("div");
    Object.assign(progressBar.style, {
        height: "100%",
        width: "0%",
        background: "#fff",
        borderRadius: "3px"
    });
    progressContainer.appendChild(progressBar);
    controls.append(backBtn, playPauseBtn, progressContainer, forwardBtn, loopBtn);

    // Load playlist from IndexedDB
    function loadPlaylistFromDB() {
        const tx = db.transaction("songs", "readonly");
        const store = tx.objectStore("songs");
        const req = store.getAll();
        req.onsuccess = function () {
            playlist = req.result;
            if (playlist.length > 0) loadTrack(currentTrack);
        };
    }

    // Load a track
    function loadTrack(index) {
        const file = playlist[index];
        if (!file) return;
        const blobURL = URL.createObjectURL(file.blob);
        audio.src = blobURL;
        audio.load();
        title.textContent = file.name;
        popup.style.background = file.thumb ? `url(${file.thumb}) center/cover` : "#222";
        currentTrack = index;
    }

    // Playback logic
    playPauseBtn.addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
            playPauseBtn.textContent = "⏸";
        } else {
            audio.pause();
            playPauseBtn.textContent = "▶️";
        }
    });
    forwardBtn.addEventListener("click", () => {
        if (currentTrack < playlist.length - 1) currentTrack++;
        else if (loopPlaylist) currentTrack = 0;
        loadTrack(currentTrack);
        audio.play();
        playPauseBtn.textContent = "⏸";
    });
    backBtn.addEventListener("click", () => {
        if (audio.currentTime < 5 && currentTrack > 0) currentTrack--;
        loadTrack(currentTrack);
        audio.play();
        playPauseBtn.textContent = "⏸";
    });
    loopBtn.addEventListener("click", () => {
        loopPlaylist = !loopPlaylist;
        loopBtn.textContent = loopPlaylist ? "↺ On" : "↺ Off";
    });
    audio.addEventListener("ended", () => {
        if (currentTrack < playlist.length - 1) currentTrack++;
        else if (loopPlaylist) currentTrack = 0;
        else return;
        loadTrack(currentTrack);
        audio.play();
        playPauseBtn.textContent = "⏸";
    });
    audio.addEventListener("timeupdate", () => {
        progressBar.style.width = ((audio.currentTime / (audio.duration || 1)) * 100) + "%";
    });
    progressContainer.addEventListener("click", e => {
        const pct = e.offsetX / progressContainer.clientWidth;
        audio.currentTime = pct * audio.duration;
    });

    closeBtn.addEventListener("click", () => {
        audio.pause();
        popup.remove();
    });

    // Drag logic
    let dragging = false, offsetX, offsetY;
    popup.addEventListener("mousedown", e => {
        if ([playPauseBtn, backBtn, forwardBtn, loopBtn, closeBtn].includes(e.target)) return;
        dragging = true;
        offsetX = e.clientX - popup.offsetLeft;
        offsetY = e.clientY - popup.offsetTop;
        popup.style.transition = "none";
    });
    document.addEventListener("mousemove", e => {
        if (!dragging) return;
        popup.style.left = e.clientX - offsetX + "px";
        popup.style.top = e.clientY - offsetY + "px";
        popup.style.bottom = "unset";
        popup.style.right = "unset";
    });
    document.addEventListener("mouseup", () => dragging = false);

    // Add song to IndexedDB
    window.addDrySong = function (name, blob, thumb) {
        if (playlist.length >= maxSongs) return alert("Max 20 songs reached!");
        const tx = db.transaction("songs", "readwrite");
        const store = tx.objectStore("songs");
        store.add({ name, blob, thumb }).onsuccess = () => {
            loadPlaylistFromDB();
        };
    };
})();
