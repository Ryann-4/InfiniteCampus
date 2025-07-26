window.addEventListener('DOMContentLoaded', () => {
let isFahrenheit = true;
let currentCity = "";
function applyDarkModeClass() {
    const isDark = localStorage.getItem("globalDarkTheme") === "true";
    const toggle = document.getElementById("toggle");
    const weather = document.getElementById("weather");
    if (isDark) {
        document.body.classList.add("w");
        if (toggle) toggle.classList.add("w");
        if (weather) weather.classList.add("w");
    } else {
        document.body.classList.remove("w");
        if (toggle) toggle.classList.remove("w");
        if (weather) weather.classList.remove("w");
    }
}
async function getLocation() {
    const locRes = await fetch("https://ipapi.co/json/");
    const loc = await locRes.json();
    currentCity = loc.city;
}
async function getWeather(city, useFahrenheit) {
    city = city.replace(/\+/g, ""); 
    const unit = useFahrenheit ? "u" : "m";
    const res = await fetch(`https://wttr.in/${city}?format=3&${unit}`);
    const text = await res.text();
    if (text.startsWith("Unknown location")) {
        document.body.innerHTML = "<div>Error#3</div>";
        return;
    }
    const weatherEl = document.getElementById("weather");
    const toggleEl = document.getElementById("toggle");
    weatherEl.innerText = text;
    weatherEl.classList.add("show");
    toggleEl.classList.add("show");
    removePlusSignsFromPage();
    applyDarkModeClass(); 
}
document.getElementById("toggle").addEventListener("click", () => {
    isFahrenheit = !isFahrenheit;
    document.getElementById("toggle").innerText = isFahrenheit ? "°C" : "°F";
    getWeather(currentCity, isFahrenheit);
});
function removePlusSignsFromPage() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    while (walker.nextNode()) {
        const node = walker.currentNode;
        node.nodeValue = node.nodeValue.replace(/\+/g, "");
    }
}
async function init() {
    await getLocation();
    getWeather(currentCity, isFahrenheit);
    removePlusSignsFromPage();
    applyDarkModeClass(); 
}
init();
});