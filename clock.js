function updateTime() {
    const now = new Date();
    
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;

    const clock = document.getElementById('clock');
    const clocks = document.getElementById('clocks');

    // Update #clock if it exists (with seconds)
    if (clock) {
        clock.textContent = `${displayHours}:${minutes}:${seconds} ${ampm}`;
    }

    // Update #clocks if it exists (no seconds)
    if (clocks) {
        clocks.textContent = `${displayHours}:${minutes} ${ampm}`;
    }
}

setInterval(updateTime, 1000);