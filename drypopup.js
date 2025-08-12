window.addEventListener('DOMContentLoaded', () => {
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
                <br>
                <a class="button" href="InfiniteTitles">
                    Tab Cloaking
                </a>
                <br>
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
    const wrapper = document.createElement('div');
    wrapper.innerHTML = popupHTML;
    document.body.appendChild(wrapper);
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