window.addEventListener('DOMContentLoaded', () => {
    let savedTitle = '';
    let savedFavicon = '';
    let betterWeatherState = false;
    try {
        savedTitle = localStorage.getItem('pageTitle') || '';
        savedFavicon = localStorage.getItem('customFavicon') || '';
        betterWeatherState = localStorage.getItem('betterWeather') === 'true';
    } catch (e) {
        console.warn('LocalStorage Not Available, Using Defaults:', e);
    }
    const popupHTML = `
        <div class="popup2" id="popup">
            <div class="bar test rgb-element">
                <div style="text-align:center; font-size:25px; margin-top:-10px;" id="clocks">
                    --:--:-- --
                </div>
            </div>
            <div class="text">
                <p class="txt">
                    Settings
                </p>
                <p style="font-size:12px; margin-top:5px;">
                    Enable More Accurate Weather?
                </p>
                <label class="switch">
                    <input type="checkbox" id="betterWeatherToggle" ${betterWeatherState ? 'checked' : ''}>
                    <span class="slider">
                    </span>
                </label>
                <br>
                <input style="width:auto !important;" class="button" type="text" id="titleInput" placeholder="Enter Page Title" value="${savedTitle}"/>
                <button class="button" id="saveTitleBtn">
                    Save Title
                </button>
                <button class="button" id="resetTitleBtn">
                    Reset Title
                </button>
                <br>
                <label for="faviconInput" class="button">
                    Choose Favicon Image
                </label>
                <input style="display:none;" type="file" id="faviconInput" accept="image/*" />
                <button class="button" id="setFaviconBtn">
                    Set Favicon
                </button>
                <button class="button" id="resetFaviconBtn">
                    Reset Favicon
                </button>
                <br>
                <br>
                <a class="button2 test darkbuttons rgb-element" href="InfiniteColors">
                    Change Site Theme
                </a>
                <br>
                <br>
                <br>
                <a class="button poll disabled">
                    Take A Quick Survey
                </a>
                <br>
                <br>
                <br>
                <a class="button" href="InfiniteBypassers">
                    Open In About:Blank
                </a>
                <br>
                <br>
                <br>
                <a class="button" href="InfiniteFeatures">
                    Suggest A Feature
                </a>
                <br>
                <br>
                <br>
                <a class="button" onclick="localStorage.clear(); location.reload();">
                    Clear Data
                </a>
                <br>
                <br>
                <br>
                <a class="button" href="InfiniteDonaters.html">
                    Help Support By Donating
                </a>
                <br>
                <br>
                <br>
                <a class="discord" href="https://discord.gg/4d9hJSVXca">
                    Join The Discord
                </a>
            </div>
            <div class="bar test rgb-element">
                <center>
                    <a class="bar headerbtn" href="InfiniteContacts" style="height:auto; width:auto; background:none; margin-top:-15px; margin-left:-50px; font-size:15px; color:inherit;">
                        Contact Me
                    </a>
                </center>
            </div>
        </div>
        <div class="settings-button test rgb-element" id="trigger">
            <img class="settings" src="https://codehs.com/uploads/fdacfa996601fc09d8da4d63fd2ca986" alt="Icon">
        </div>
        <center>
    `;
    const styleEl = document.createElement('style');
    styleEl.textContent = `
    .switch {
      position: relative;
      display: inline-block;
      width: 50px;
      height: 24px;
    }
    .switch input { display: none; }
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0; left: 0; right: 0; bottom: 0;
      background-color: #ccc;
      transition: .4s;
      border-radius: 24px;
    }
    .slider:before {
      position: absolute;
      content: "";
      height: 18px; width: 18px;
      left: 5px; bottom: 5px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
    input:checked + .slider {
      background-color: lime;
    }
    input:checked + .slider:before {
      transform: translateX(26px);
    }
    `;
    document.head.appendChild(styleEl);
    const wrapper = document.createElement('div');
    wrapper.innerHTML = popupHTML;
    document.body.appendChild(wrapper);
    const betterWeatherToggle = document.getElementById('betterWeatherToggle');
    betterWeatherToggle.addEventListener('change', function () {
        const isEnabled = this.checked;
        localStorage.setItem('betterWeather', isEnabled ? 'true' : 'false');
        if (isEnabled && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                    const data = await response.json();      
                    const city = data.address.city || data.address.town || data.address.village || '';
                    const state = data.address.state || '';
                    sessionStorage.setItem('city', city);
                    sessionStorage.setItem('state', state);
                } catch (err) {
                    console.warn('Failed To Get City/State:', err);
                }
            }, (error) => {
                console.warn('Geolocation Error:', error);
            });
        }
    });
    const button = document.getElementById('trigger');
    const popup = document.getElementById('popup');
    if (button && popup) {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = popup.classList.contains('shows');
            popup.classList.toggle('shows');
            button.classList.toggle('actives', !isOpen);
        });
        document.addEventListener('click', (e) => {
            if (!popup.contains(e.target) && !button.contains(e.target)) {
                popup.classList.remove('shows');
                button.classList.remove('actives');
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                popup.classList.remove('shows');
                button.classList.remove('actives');
            }
        });
    }
    const titleInput = document.getElementById('titleInput');
    const saveTitleBtn = document.getElementById('saveTitleBtn');
    const resetTitleBtn = document.getElementById('resetTitleBtn');
    function setTitle(newTitle) {
        document.title = newTitle || 'Infinite Campus';
    }
    if (savedTitle) {
        setTitle(savedTitle);
    }
    saveTitleBtn.addEventListener('click', () => {
        const newTitle = titleInput.value.trim();
        if (newTitle.length > 0) {
            localStorage.setItem('pageTitle', newTitle);
            setTitle(newTitle);
        } else {
            alert('Please Enter A Valid Title Before Saving.');
        }
    });
    resetTitleBtn.addEventListener('click', () => {
        localStorage.removeItem('pageTitle');
        titleInput.value = '';
        setTitle('Infinite Campus');
    });
    const faviconInput = document.getElementById('faviconInput');
    const setFaviconBtn = document.getElementById('setFaviconBtn');
    const resetFaviconBtn = document.getElementById('resetFaviconBtn');
    const originalFaviconLink = document.querySelector("link[rel~='icon']");
    const originalFaviconUrl = originalFaviconLink ? originalFaviconLink.href : '/favicon.ico';
    function updateFavicon(url) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = url;
    }
    if (savedFavicon) {
        updateFavicon(savedFavicon);
    }
    setFaviconBtn.addEventListener('click', () => {
        const file = faviconInput.files[0];
        if (!file) {
            alert('Please Select An Image File First.');
            return;
        }
        const reader = new FileReader();
        reader.onload = function(e) {
            const dataUrl = e.target.result;
            localStorage.setItem('customFavicon', dataUrl);
            updateFavicon(dataUrl);
        };
        reader.readAsDataURL(file);
    });
    resetFaviconBtn.addEventListener('click', () => {
        localStorage.removeItem('customFavicon');
        faviconInput.value = '';
        updateFavicon(originalFaviconUrl);
    });
    function updateTime() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const clock = document.getElementById('clock');
        const clocks = document.getElementById('clocks');
        if (clock) {
            clock.textContent = `${displayHours}:${minutes}:${seconds} ${ampm}`;
        }
        if (clocks) {
            clocks.textContent = `${displayHours}:${minutes} ${ampm}`;
        }
    }
    updateTime();
    setInterval(updateTime, 1000);
});