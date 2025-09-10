function safeGetItem(key) {
    try {
        return localStorage.getItem(key);
    } catch (err) {
        console.warn(`LocalStorage Unavailable For Key: ${key}`, err);
        return null;
    }
}
function safeSetItem(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (err) {
        console.warn(`LocalStorage Unavailable For Key: ${key}`, err);
    }
}
const a = "TWZocGp3OTY=";
const b = "WGp1d3M2NzY1Jg==";
const c = "Tml0cml4";
const d = "RGFkZHlOaXRyaXg2OQ==";
const e = "QWl6YVN5QWd6NjZYNW9RRzZKdnJKamlWRVd3VEtJNFRsZnhBNHF3";
const f = "bXl5dXg/NDRpbnhodHdpM2h0cjRmdW40fGpnbXR0cHg0Njg9Pjs4NTY1Ojs6Pjc5OTw+OjQ2Pl16OHJQPk1qUHVLfV95alpxa2teTTdUS1JWOkc5XGtzXmd4bzdTaFBUVU5VdXA2clRYc11YMl5pSjpceVNfVnNJUA==";
const g = "bXl5dXg/NDRpbnhodHdpM2h0cjRmdW40fGpnbXR0cHg0Njg9Pjg4OTg8Nzw1PD4+Nj03NzR3fEk1ZEtkVUdId3JsfEd2bm1RO2o2VTVHTnhWUmRMb3htdX5ZV1I2VGxca0Z3XnZ5OWRxZ0dQWDY1eFB8U1A9SDdLVg==";
const h = "SW5maW5pdGVBZG1pblVwZGF0ZXJz";
const i = '';
const j = `PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3R5bGU9IndpZHRoOjEwMHZ3ICFpbXBvcnRhbnQ7IGhlaWdodDoxMDB2aCAhaW1wb3J0YW50OyI+PHRpdGxlPkluZmluaXRlIENhbXB1czwvdGl0bGU+PGZvcmVpZ25PYmplY3QgeD0iMCIgeT0iMCIgc3R5bGU9IndpZHRoOjEwMHZ3ICFpbXBvcnRhbnQ7IGhlaWdodDoxMDB2aCAhaW1wb3J0YW50OyI+PGVtYmVkIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sIiBzcmM9IiR7dXJsfSIgdHlwZT0idGV4dC9wbGFpbiIgc3R5bGU9ImhlaWdodDoxMDB2aCAhaW1wb3J0YW50OyB3aWR0aDoxMDB2dyAhaW1wb3J0YW50OyIgLz48L2ZvcmVpZ25PYmplY3Q+PC9zdmc+Cg==`;
const k = "PGh0bWwgbGFuZz0iZW4iPgo8aGVhZD4KPG1ldGEgY2hhcnNldD0iVVRGLTgiPgo8bWV0YSBuYW1lPSJ2aWV3cG9ydCIgY29udGVudD0id2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEuMCI+Cjx0aXRsZT5JbmZpbml0ZSBDYW1wdXM8L3RpdGxlPgo8c3R5bGU+CmJvZHk6Oi13ZWJraXQtc2Nyb2xsYmFyIHsgZGlzcGxheTogbm9uZTsgfQpib2R5IHsgbWFyZ2luOjBweDsgfQo8L3N0eWxlPgo8L2hlYWQ+Cjxib2R5Pgo8aWZyYW1lIHN0eWxlPSJoZWlnaHQ6MTAwdmg7IHdpZHRoOjEwMHZ3OyIgc3JjPSJQVVRfVVJMX0hFUkUiPjwvaWZyYW1lPgo8L2JvZHk+CjwvaHRtbD4=";
const l = "SW5maW5pdGVTZWNyZXRQYWdlcw==";
const m = "https://discord.com/api/guilds/1002698920809463808/widget.json";
const n = "aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTM4OTcwNzcwMDQ1OTUzNjUyNC9tMlBJRkwtdGdpd1dkX2ZyTWV4c1NXb001Z2ZNNE56TzFkeEYyQWRqQThvY18tckswbzFYRTBDWGlUS0VPcXFZaldabw==";
const o = ["Dad", "Default Bot", "Infinite Campus", "Log Bot", "Music Bot"];
const p = [
    { username: "SGFja2VyNDE=", password: "U2Vwcm4xMjEwIQ==" },
    { username: "Tml0cml4", password: "RGFkZHlOaXRyaXg2OQ==" }
];
const q = "aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTQwMDE3NjUwMDc3ODQ2NzQ4OS9FTlhLTmE4TGZfYXN4bVR3VFlIbkdiT05PRWRva2hQZXVfeUE1UU9oQ2ZlaUpPbzBCbXkwWVRZNHB1UEt3TnlSbFZpMg==";
const r = [
    { usr: "U0dGamEyVnlOREU9", psw: "VTJWd2NtNHhNakV3SVE9PQ==", KY: "YUdGamEyVnlOREU9"},
    { usr: "VG1sMGNtbDQ=", psw: "UkdGa1pIbE9hWFJ5YVhnMk9RPT0=", KY: "Ym1sMGNtbDQ=" }
];
const s = "AIzaSyCQ492BiasyGJyXPQcm-2TFAeWdZybScz0";
const t = "AIzaSyCW40bRS58QSP6A---j6wCFtd-g8Ta9luA";
const u = "AIzaSyCtIplvgvwVDF6ke3Mz4Qv3Sny99eh_gCY";
const key = 5;
console.log('%cWelcome To The Console, If You Do Not Know What You Are Doing, Close It, If You Do I Would Be Happy To Let You Develop The Website With Me infinitecodehs@gmail.com', 'color: purple; font-size: 24px; font-weight: bold;');
console.log('%cC', `
    font-size: 100px;
    padding: 1px 35px 1px 35px;
    background-size: cover;
    border-radius:10px;
    font-family: 'Montserrat', sans-serif;
    font-weight:bold;
    color: #8BC53F;
    background-color: #121212;
`);
function padlet() { window.open("https://padlet.com/newsomr95/chat-room-br2tjbusbebezr2n"); }
function converter() { window.open("https://spotidownloader.com/en"); }
function puter() { window.open("https://puter.com"); }
function thumbnail() { window.open("https://tagmp3.net/"); }
function ITU() { window.open("https://postimage.org/"); }
window.addEventListener('DOMContentLoaded', () => {
    let isFahrenheit = true;
    let currentCity = "";
    function setPopup2Color(isDark) {
        document.querySelectorAll('.popup2').forEach(el => {
            el.style.color = isDark ? 'white' : 'black';
        });
    }
    function applyDarkModeClass() {
        const isDark = safeGetItem("globalDarkTheme") === "true";
        const toggle = document.getElementById("toggle");
        const weather = document.getElementById("weather");
        const poppups = document.getElementById("ppupcolor");
        if (isDark) {
            document.body.classList.add("w");
            if (toggle) toggle.classList.add("w");
            if (weather) weather.classList.add("w");
            if (poppups) poppups.classList.add("w");
        } else {
            document.body.classList.remove("w");
            if (toggle) toggle.classList.remove("w");
            if (weather) weather.classList.remove("w");
            if (poppups) poppups.classList.remove("w");
        }
        setPopup2Color(isDark);
    }
    const observer = new MutationObserver(() => {
        const isDark = safeGetItem("globalDarkTheme") === "true";
        setPopup2Color(isDark);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    async function getLocation() {
        try {
            let city = sessionStorage.getItem('city');
            let state = sessionStorage.getItem('state');
            if (city && state) {
                currentCity = city;
                return;
            }
            if (safeGetItem("betterWeather") === "true" && navigator.geolocation) {
                await new Promise((resolve) => {
                    navigator.geolocation.getCurrentPosition(async (pos) => {
                        const lat = pos.coords.latitude;
                        const lon = pos.coords.longitude;
                        try {
                            const revRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                            const revData = await revRes.json();
                            currentCity = revData.address.city || revData.address.town || revData.address.village || "";
                            state = revData.address.state || "";
                            sessionStorage.setItem('city', currentCity);
                            sessionStorage.setItem('state', state);
                            resolve();
                        } catch (err) {
                            console.warn("Reverse Geocode Failed, Fallback To IP:", err);
                            await fallbackToIP(resolve);
                        }
                    }, async (err) => {
                        console.warn("Geolocation Failed, Fallback To IP:", err);
                        await fallbackToIP(resolve);
                    });
                });
            } else {
                await fallbackToIP();
            }
        } catch (error) {
            console.error("Failed To Get Location:", error);
            currentCity = "";
        }
    }
    async function fallbackToIP(resolve) {
        try {
            const locRes = await fetch("https://ipapi.co/json/");
            if (!locRes.ok) throw new Error("IP Location Unavailable");
            const loc = await locRes.json();
            currentCity = loc.city || "";
            const state = loc.region || "";
            sessionStorage.setItem('city', currentCity);
            sessionStorage.setItem('state', state);
        } catch (err) {
            console.error("IP Fallback Failed:", err);
            currentCity = "";
        }
        if (resolve) resolve();
    }
    async function getWeather(city, useFahrenheit) {
        city = city.replace(/\+/g, "");
        const unit = useFahrenheit ? "u" : "m";
        const res = await fetch(`https://wttr.in/${city}?format=3&${unit}`);
        const text = await res.text();
        if (text.startsWith("Unknown Location")) {
            document.body.innerHTML = "<div>Error #3</div>";
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
    function removePlusSignsFromPage() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        while (walker.nextNode()) {
            const node = walker.currentNode;
            node.nodeValue = node.nodeValue.replace(/\+/g, "");
        }
    }
    document.getElementById("toggle")?.addEventListener("click", () => {
        isFahrenheit = !isFahrenheit;
        document.getElementById("toggle").innerText = isFahrenheit ? "°C" : "°F";
        getWeather(currentCity, isFahrenheit);
    });
    async function initWeather() {
        await getLocation();
        getWeather(currentCity, isFahrenheit);
        removePlusSignsFromPage();
        applyDarkModeClass();
    }
    const savedTitle = safeGetItem('pageTitle');
    if (savedTitle) document.title = savedTitle;
    const savedFavicon = safeGetItem('customFavicon');
    if (savedFavicon) {
        const favicon = document.getElementById('dynamic-favicon');
        if (favicon) favicon.href = savedFavicon;
    }
    initWeather();
    function invertColor(rgb) {
        const match = rgb.match(/\d+/g);
        if (!match || match.length < 3) return '#000';
        const r = 255 - parseInt(match[0]);
        const g = 255 - parseInt(match[1]);
        const b = 255 - parseInt(match[2]);
        return `rgb(${r}, ${g}, ${b})`;
    }
    function applyInvertedColors() {
        const darkElement = document.querySelector('.darkbuttons');
        const lightElements = document.querySelectorAll('.lightbuttons');
        if (!darkElement || lightElements.length === 0) return;
        const darkBg = getComputedStyle(darkElement).color;
        const invertedColor = invertColor(darkBg);
        lightElements.forEach(el => {
            el.style.color = invertedColor;
        });
    }
    applyInvertedColors();
    const panicKey = safeGetItem("panicKey");
    const panicUrl = safeGetItem("panicUrl");
    if (panicKey && panicUrl) {
        document.addEventListener("keydown", (e) => {
            if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
            if (e.key === panicKey) {
                window.location.href = panicUrl;
            }
        });
    }
});