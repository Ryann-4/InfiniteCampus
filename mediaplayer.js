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
if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play',  () => { audio.play();  playPauseBtn.textContent = '||'; });
    navigator.mediaSession.setActionHandler('pause', () => { audio.pause(); playPauseBtn.textContent = '▶'; });
    navigator.mediaSession.setActionHandler('previoustrack', () => backBtn.click());
    navigator.mediaSession.setActionHandler('nexttrack',     () => forwardBtn.click());
}
fileInput.addEventListener('change', () => {
    const files = Array.from(fileInput.files).slice(0, 20);
    if (!files.length) return;
    playlist     = files;
    currentTrack = 0;
    updatePlaylistUI();
    loadTrack(currentTrack);
    player.style.display = 'block';
});
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
        });
        li.addEventListener('dragend', () => li.classList.remove('dragging'));

        playlistElement.appendChild(li);
    });
}
async function loadTrack(index) {
    const file = playlist[index];
    if (!file) return;
    const url = URL.createObjectURL(file);
    audio.src = url;
    audio.load();
    const cleanName = file.name.replace(/\.mp3$/i, '');
    filenameDisplay.innerHTML = `<span style="text-align:center"> ${cleanName}<br><br></span>`;
    playPauseBtn.textContent = '▶';
    progressBar.style.width = '0%';
    timeDisplay.textContent = '0:00 / 0:00';
    updatePlaylistUI();
    const albumArt = document.getElementById('albumArt');
    let artworkURL = 'https://codehs.com/uploads/f111a37947de2cea81db858094c04f2d';
    try {
        const mm = await import('https://cdn.jsdelivr.net/npm/music-metadata@10.8.3/+esm');
        const { common } = await mm.parseBlob(file);
        if (common.picture && common.picture.length > 0) {
            const picture = common.picture[0];
            const base64String = btoa(String.fromCharCode(...new Uint8Array(picture.data)));
            artworkURL = `data:${picture.format};base64,${base64String}`;
        }
    } catch (e) {
        console.warn('Could not extract album art:', e.message);
    }
    const img = new Image();
    img.src = artworkURL;
    img.onload = () => {
    albumArt.src = artworkURL;
    document.getElementById('coverBackground').style.backgroundImage = `url("${artworkURL}")`;
    updateMediaSession(cleanName, artworkURL);
};
img.onerror = () => {
    console.warn('Failed to load album art image, using fallback');
    artworkURL = 'https://codehs.com/uploads/f111a37947de2cea81db858094c04f2d';
    img.onload = () => {
        albumArt.src = artworkURL;
        document.getElementById('coverBackground').style.backgroundImage = `url("${artworkURL}")`;
        updateMediaSession(cleanName, artworkURL);
    };
}; 
}
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
playPauseBtn.addEventListener('click', () =>
    audio.paused ? (audio.play(),  playPauseBtn.textContent = '||')
                 : (audio.pause(), playPauseBtn.textContent = '▶')
);
forwardBtn.addEventListener('click', nextTrack);
backBtn.addEventListener('click', () => {
    if (audio.currentTime < 10 && currentTrack > 0) currentTrack--;
    loadTrack(currentTrack);
    audio.play();
    playPauseBtn.textContent = '||';
});
loopBtn.addEventListener('click', () => {
    loopPlaylist = !loopPlaylist;
    loopBtn.textContent = loopPlaylist ? '↺ On' : '↺ Off';
});
audio.addEventListener('ended', nextTrack);
function nextTrack() {
    if (currentTrack < playlist.length - 1) currentTrack++;
    else if (loopPlaylist) currentTrack = 0;
    else return;
    loadTrack(currentTrack);
    audio.play();
    playPauseBtn.textContent = '||';
}
audio.addEventListener('timeupdate', () => {
    const pct = (audio.currentTime / (audio.duration || 1)) * 100;
    progressBar.style.width = `${pct}%`;
    timeDisplay.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration || 0)}`;
});
progressContainer.addEventListener('click', e => {
    const pct = (e.clientX - progressContainer.getBoundingClientRect().left) / progressContainer.clientWidth;
    audio.currentTime = pct * audio.duration;
});
document.addEventListener('keydown', e => {
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
    if (e.code === 'Space') {
        e.preventDefault();
        playPauseBtn.click();
    }
});
function formatTime(sec=0) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}