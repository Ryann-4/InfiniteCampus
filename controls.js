const video = document.getElementById('video');
const playPauseBtn = document.getElementById('playPause');
const progress = document.getElementById('progress');
const progressFilled = document.getElementById('progressFilled');
const timeDisplay = document.getElementById('time');
const volumeSlider = document.getElementById('volume');
const fullscreenBtn = document.getElementById('fullscreen');
const captionsBtn = document.getElementById('captionsToggle');
const downloadBtn = document.getElementById('downloadBtn');
const playbackRateSelect = document.getElementById('playbackRate');
const textTracks = video.textTracks[0];
let captionSize = 1;
function updateCaptionStyle() {
    const styleTag = document.querySelector('style[data-caption-style]') || document.createElement('style');
    styleTag.setAttribute('data-caption-style', 'true');
    styleTag.textContent = `::cue { font-size: ${captionSize}em; }`;
    document.head.appendChild(styleTag);
}
function togglePlay() {
    if (video.paused) {
        video.play();
        playPauseBtn.textContent = '❚❚';
    } else {
        video.pause();
        playPauseBtn.textContent = '►';
    }
}
function updateProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressFilled.style.width = `${percent}%`;
    updateTimeDisplay();
}
function scrub(e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}
function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
function updateTimeDisplay() {
    timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
}
function handleVolume() {
    video.volume = volumeSlider.value;
}
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        video.parentElement.requestFullscreen();
        video.style.height = '100vh';
        video.style.width = '100vw';
    } else {
        document.exitFullscreen();
        video.style.height = '90vh';
        video.style.width = '100vw';
    }
}
function toggleCaptions() {
    if (!textTracks) return;
    if (textTracks.mode === 'showing') {
        textTracks.mode = 'disabled';
        captionsBtn.style.opacity = 0.5;
    } else {
        textTracks.mode = 'showing';
        captionsBtn.style.opacity = 1;
    }
}
downloadBtn.addEventListener('click', () => {
    const source = video.querySelector('source').src;
    const a = document.createElement('a');
    a.href = source;
    a.download = source.split('/').pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});
playbackRateSelect.addEventListener('change', () => {
    video.playbackRate = parseFloat(playbackRateSelect.value);
});
playPauseBtn.addEventListener('click', togglePlay);
video.addEventListener('click', togglePlay);
video.addEventListener('timeupdate', updateProgress);
video.addEventListener('loadedmetadata', updateTimeDisplay);
progress.addEventListener('click', scrub);
volumeSlider.addEventListener('input', handleVolume);
fullscreenBtn.addEventListener('click', toggleFullscreen);
captionsBtn.addEventListener('click', toggleCaptions);
if (textTracks) {
    textTracks.mode = 'showing';
    captionsBtn.style.opacity = 1;
    updateCaptionStyle();
}
document.addEventListener('keydown', function (e) {
    const tag = document.activeElement.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;
    switch (e.key.toLowerCase()) {
        case ' ':
        case 'spacebar':
        case 'k':
            e.preventDefault();
            togglePlay();
            break;
        case 'c':
            toggleCaptions();
            break;
        case 'f':
            toggleFullscreen();
            break;
        case 'm':
            video.muted = !video.muted;
            break;
        case 'arrowright':
        case 'l':
            video.currentTime = Math.min(video.duration, video.currentTime + 5);
            break;
        case 'arrowleft':
        case 'j':
            video.currentTime = Math.max(0, video.currentTime - 5);
            break;
        case 'arrowup':
            e.preventDefault();
            video.volume = Math.min(1, video.volume + 0.1);
            volumeSlider.value = video.volume;
            break;
        case 'arrowdown':
            e.preventDefault();
            video.volume = Math.max(0, video.volume - 0.1);
            volumeSlider.value = video.volume;
            break;
        case '+':
        case '=':
            captionSize = Math.min(captionSize + 0.1, 2);
            updateCaptionStyle();
            break;
        case '-':
        case '_':
            captionSize = Math.max(captionSize - 0.1, 0.5);
            updateCaptionStyle();
            break;
    }
    showControls();
});
const shrekControls = document.querySelector('.shrekcontrols');
let hideControlsTimeout;
function showControls() {
    shrekControls.classList.remove('hidden');
    resetHideControlsTimer();
}
function hideControls() {
    shrekControls.classList.add('hidden');
}
function resetHideControlsTimer() {
    clearTimeout(hideControlsTimeout);
    hideControlsTimeout = setTimeout(hideControls, 5000);
}
['mousemove', 'click', 'keydown'].forEach(evt =>
    document.addEventListener(evt, showControls)
);
shrekControls.addEventListener('mouseenter', () => clearTimeout(hideControlsTimeout));
shrekControls.addEventListener('mouseleave', resetHideControlsTimer);
video.addEventListener('play', resetHideControlsTimer);
video.addEventListener('pause', showControls);