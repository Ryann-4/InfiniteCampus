const a = "TWZocGp3OTY=";
const b = "WGp1d3M2NzY1Jg==";
const c = "Tml0cml4";
const d = "RGFkZHlOaXRyaXg2OQ==";
const e = "QWl6YVN5QWd6NjZYNW9RRzZKdnJKamlWRVd3VEtJNFRsZnhBNHF3";
const f = "bXl5dXg/NDRpbnhodHdpM2h0cjRmdW40fGpnbXR0cHg0Njg9Pjs4NTY1Ojs6Pjc5OTw+OjQ2Pl16OHJQPk1qUHVLfV95alpxa2teTTdUS1JWOkc5XGtzXmd4bzdTaFBUVU5VdXA2clRYc11YMl5pSjpceVNfVnNJUA==";
const g = "bXl5dXg/NDRpbnhodHdpM2h0cjRmdW40fGpnbXR0cHg0Njg9Pjg4OTg8Nzw1PD4+Nj03NzR3fEk1ZEtkVUdId3JsfEd2bm1RO2o2VTVHTnhWUmRMb3htdX5ZV1I2VGxca0Z3XnZ5OWRxZ0dQWDY1eFB8U1A9SDdLVg==";
const h = "SW5maW5pdGVBZG1pblVwZGF0ZXJz";
const i = 'https://discord-proxy1.onrender.com';
const j = atob("aW5maW5pdGVjb2RlaHNAZ21haWwuY29t");
const k = atob("aW5maW5pdGU=");
const l = "SW5maW5pdGVTZWNyZXRQYWdlcw==";
const m = "https://discord.com/api/guilds/1002698920809463808/widget.json";
const n = "aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTM4OTcwNzcwMDQ1OTUzNjUyNC9tMlBJRkwtdGdpd1dkX2ZyTWV4c1NXb001Z2ZNNE56TzFkeEYyQWRqQThvY18tckswbzFYRTBDWGlUS0VPcXFZaldabw==";
const o = ["Dad", "Default Bot", "Infinite Campus", "Log Bot", "Music Bot"];
const p = [
  { username: "SGFja2VyNDE=", password: "U2Vwcm4xMjEwIQ==" },
  { username: "Tml0cml4", password: "RGFkZHlOaXRyaXg2OQ==" }
];
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

  // --- NEW FUNCTION TO HANDLE .popup2 COLOR ---
  function setPopup2Color(isDark) {
    document.querySelectorAll('.popup2').forEach(el => {
      el.style.color = isDark ? 'white' : 'black';
    });
  }

  function applyDarkModeClass() {
    const isDark = localStorage.getItem("globalDarkTheme") === "true";
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

    // --- ENSURE .popup2 COLOR UPDATES ---
    setPopup2Color(isDark);
  }

  // --- OBSERVE DOM FOR DYNAMIC .popup2 ELEMENTS ---
  const observer = new MutationObserver(() => {
    const isDark = localStorage.getItem("globalDarkTheme") === "true";
    setPopup2Color(isDark);
  });
  observer.observe(document.body, { childList: true, subtree: true });

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

  const savedTitle = localStorage.getItem('pageTitle');
  if (savedTitle) document.title = savedTitle;
  const savedFavicon = localStorage.getItem('customFavicon');
  if (savedFavicon) {
    const favicon = document.getElementById('dynamic-favicon');
    if (favicon) favicon.href = savedFavicon;
  }

  initWeather();
});
