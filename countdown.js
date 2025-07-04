let timer;

function startCountdown() {
    clearInterval(timer);
    const format = "dmy"; // Use your format here, hardcoded for this example
    const dateStr = document.getElementById("dateInput").value.trim();
    const timeStr = document.getElementById("timeInput").value.trim();
    const parsedDate = parseDateTime(dateStr, timeStr, format);
    
    if (!parsedDate || isNaN(parsedDate.getTime())) {
        alert("Invalid date or time.");
        return;
    }

    // Save the time to localStorage
    localStorage.setItem('countdownTarget', parsedDate.toISOString());

    // Show the popup and start the countdown
    document.getElementById('popup').style.display = 'block';

    timer = setInterval(() => updateCountdown(parsedDate), 1000);
    updateCountdown(parsedDate);
}

function parseDateTime(dateStr, timeStr, format) {
    const dateParts = dateStr.split("/");
    if (dateParts.length !== 3) return null;
    let day, month, year;
    if (format === "mdy") {
        [month, day, year] = dateParts;
    } else {
        [day, month, year] = dateParts;
    }
    const timeParts = (timeStr || "00:00:00").split(":");
    const hours = parseInt(timeParts[0] || 0);
    const minutes = parseInt(timeParts[1] || 0);
    const seconds = parseInt(timeParts[2] || 0);
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), hours, minutes, seconds);
}

function updateCountdown(targetDate) {
    const now = new Date();
    let diff = Math.floor((targetDate - now) / 1000);

    if (diff <= 0) {
        clearInterval(timer);
        document.getElementById("days").textContent = "Time's up!";
        document.getElementById("hours").textContent = "";
        document.getElementById("minutes").textContent = "";
        document.getElementById("seconds").textContent = "";
        closePopup(); // Automatically close the popup when time's up
        return;
    }

    const days = Math.floor(diff / (60 * 60 * 24));
    diff %= (60 * 60 * 24);
    const hours = Math.floor(diff / 3600);
    diff %= 3600;
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;

    document.getElementById("days").textContent = `Days: ${days}`;
    document.getElementById("hours").textContent = `Hours: ${hours}`;
    document.getElementById("minutes").textContent = `Minutes: ${minutes}`;
    document.getElementById("seconds").textContent = `Seconds: ${seconds}`;
}

function closePopup() {
    document.getElementById("popup").style.display = 'none';
    localStorage.removeItem('countdownTarget'); // Optional: Clear the saved data after the popup closes
}

// Make the popup draggable
let offsetX, offsetY, isDragging = false;

document.getElementById('popup').addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - document.getElementById('popup').offsetLeft;
    offsetY = e.clientY - document.getElementById('popup').offsetTop;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        document.getElementById('popup').style.left = `${e.clientX - offsetX}px`;
        document.getElementById('popup').style.top = `${e.clientY - offsetY}px`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// If a countdown was saved, start it on page load
window.onload = function() {
    const savedTime = localStorage.getItem('countdownTarget');
    if (savedTime) {
        const parsedDate = new Date(savedTime);
        document.getElementById('popup').style.display = 'block';
        timer = setInterval(() => updateCountdown(parsedDate), 1000);
        updateCountdown(parsedDate);
    }
};
