let timer;
function startCountdown() {
    clearInterval(timer);
    const format = document.getElementById("format").value;
    const dateStr = document.getElementById("dateInput").value.trim();
    const timeStr = document.getElementById("timeInput").value.trim();
    const parsedDate = parseDateTime(dateStr, timeStr, format);
    if (!parsedDate || isNaN(parsedDate.getTime())) {
        alert("Err#2 Invalid Date Or Time.");
        return;
    }
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
    return new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        hours,
        minutes,
        seconds
    );
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
        return;
    }
    const days = Math.floor(diff / (60 * 60 * 24));
    diff %= (60 * 60 * 24);
    const hours = Math.floor(diff / 3600);
    diff %= 3600;
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    const daysEl = document.getElementById("days");
    daysEl.textContent = `Days: ${days}`;
    document.getElementById("hours").textContent = `Hours: ${hours}`;
    document.getElementById("minutes").textContent = `Minutes: ${minutes}`;
    document.getElementById("seconds").textContent = `Seconds: ${seconds}`;
}
document.getElementById("dateInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") startCountdown();
});
document.getElementById("timeInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") startCountdown();
});