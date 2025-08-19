(function () {
    if (document.getElementById("dry-music-popup")) return;

    const maxSongs = 20;
    let playlist = JSON.parse(sessionStorage.getItem("dry_playlist") || "[]");
    let currentTrack = Number(sessionStorage.getItem("dry_currentTrack") || 0);
    let loopPlaylist = sessionStorage.getItem("dry_loopPlaylist") === "true";

    // Create popup
    const popup = document.createElement("div");
    popup.id = "dry-music-popup";
    popup.style.position = "fixed";
    popup.style.bottom = "20px";
    popup.style.right = "20px";
    popup.style.width = "300px";
    popup.style.height = "120px";
    popup.style.borderRadius = "10px";
    popup.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)";
    popup.style.display = "flex";
    popup.style.flexDirection = "column";
    popup.style.alignItems = "center";
    popup.style.justifyContent = "center";
    popup.style.color = "#fff";
    popup.style.cursor = "move";
    popup.style.zIndex = "9999";
    popup.style.backgroundSize = "cover";
    popup.style.backgroundPosition = "center";
    document.body.appendChild(popup);

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "✖";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "5px";
    closeBtn.style.right = "5px";
    closeBtn.style.border = "none";
    closeBtn.style.background = "rgba(0,0,0,0.6)";
    closeBtn.style.color = "white";
    closeBtn.style.borderRadius = "50%";
    closeBtn.style.width = "24px";
    closeBtn.style.height = "24px";
    closeBtn.style.cursor = "pointer";
    popup.appendChild(closeBtn);

    // Song title
    const title = document.createElement("div");
    title.style.fontSize = "14px";
    title.style.fontWeight = "bold";
    title.style.marginTop = "10px";
    popup.appendChild(title);

    // Audio element
    const audio = document.createElement("audio");
    audio.style.display = "none";
    popup.appendChild(audio);

    // Controls
    const controls = document.createElement("div");
    controls.style.marginTop = "10px";
    controls.style.display = "flex";
    controls.style.alignItems = "center";
    controls.style.justifyContent = "space-between";
    controls.style.width = "90%";
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
    loopBtn.textContent = loopPlaylist ? "↺ On" : "↺ Off";

    const progressContainer = document.createElement("div");
    progressContainer.style.flex = "1";
    progressContainer.style.height = "6px";
    progressContainer.style.background = "rgba(255,255,255,0.3)";
    progressContainer.style.margin = "0 10px";
    progressContainer.style.borderRadius = "3px";
    progressContainer.style.position = "relative";
    const progressBar = document.createElement("div");
    progressBar.style.height = "100%";
    progressBar.style.width = "0%";
    progressBar.style.background = "#fff";
    progressBar.style.borderRadius = "3px";
    progressContainer.appendChild(progressBar);

    controls.append(backBtn, playPauseBtn, progressContainer, forwardBtn, loopBtn);

    // Load current track
    function loadTrack(index) {
        const file = playlist[index];
        if (!file) return;
        audio.src = file.url;
        audio.load();
        title.textContent = file.name;
        popup.style.background = file.thumb ? `url(${file.thumb}) center/cover` : "#222";
        sessionStorage.setItem("dry_currentTrack", index);
    }

    // Play / Pause
    playPauseBtn.addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
            playPauseBtn.textContent = "⏸";
        } else {
            audio.pause();
            playPauseBtn.textContent = "▶️";
        }
    });

    // Next / Previous
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
        sessionStorage.setItem("dry_loopPlaylist", loopPlaylist);
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
        const pct = (audio.currentTime / (audio.duration || 1)) * 100;
        progressBar.style.width = pct + "%";
    });

    progressContainer.addEventListener("click", e => {
        const pct = (e.offsetX / progressContainer.clientWidth);
        audio.currentTime = pct * audio.duration;
    });

    closeBtn.addEventListener("click", () => {
        audio.pause();
        popup.remove();
    });

    // Drag
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

    // Restore playlist from sessionStorage
    playlist.forEach((file, i) => {
        if (i === currentTrack) loadTrack(i);
    });

    // Public function to add new file
    window.addDrySong = function (name, url, thumb) {
        if (playlist.length >= maxSongs) return alert("Max 20 songs reached!");
        playlist.push({ name, url, thumb });
        sessionStorage.setItem("dry_playlist", JSON.stringify(playlist));
        loadTrack(playlist.length - 1);
        audio.play();
        playPauseBtn.textContent = "⏸";
    };

})();
