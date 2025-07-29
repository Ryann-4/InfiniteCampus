const headerHTML = `
<style>
    .dropdown {
        position: absolute;
        top: 50px;
        right: 590px;
        display: none;
        flex-direction: column;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        z-index: 1000;
        background: inherit;
    }
    .dropdown button {
        background: transparent;
        border: none;
        padding: 10px 15px;
        text-align: left;
        cursor: pointer;
        color: white;
        transition: background 0.3s;
    }
    .dropdown button:hover {
    background-color:transparent
    }
    .dropdown-toggle {
        cursor: pointer;
    }
</style>
<strong>
    <header id="site-header">
        <div class="test">
        </div>
        <div id="location">
        </div>
        <div style="margin-top:1.5vh;" id="weather-container">
            <div id="global-text">
                <pre id="weather">
                </pre>
            </div>
            <div id="global-text">
                <button class="cfbtn" id="toggle">
                    °C
                </button>
            </div>
        </div>
        <a href="https://ryann-4.github.io/InfiniteCampus">
            <img class="logo" src="https://codehs.com/uploads/d3ca105004013f2dc047f4bc0f669f6a" alt="Campus" style="left:335">
        </a>
        <a class="headerbtn" style="right:710; top:14" href="InfiniteAbouts">
            About
        </a>
        <div id="appsToggle" class="dropdown-toggle headerbtn" style="right:650; top:14; position:absolute;">
            Apps
        </div>
        <div style="right:650; top:50px;" class="dropdown" id="appsDropdown">
            <button style="font-weight:bold;" onclick="location.href='InfiniteNettle1'">
                NettleWeb (1)
            </button>
            <button style="font-weight:bold;" onclick="location.href='InfiniteNettle2'">
                NettleWeb (2)
            </button>
            <button style="font-weight:bold;" onclick="location.href='InfiniteMinecrafters'">
                Minecraft
            </button>
            <button style="font-weight:bold;" onclick="location.href='InfiniteProxies'">
                Proxies List
            </button>
            <button style="font-weight:bold;" onclick="location.href='InfiniteTubers'">
                How To Unblock Youtube
            </button>
            <button style="font-weight:bold;" onclick="location.href='InfiniteBrowsers'">
                Browsers
            </button>
            <button style="font-weight:bold;" onclick="location.href='InfinitePlayers'">
                20 File MP3 Player
            </button>
            <button style="font-weight:bold;" onclick="location.href='InfinitePlacers'">
                R/Place
            </button>
            <button style="font-weight:bold;" onclick="location.href='InfiniteCounters'">
                Time Until Calculator
            </button>
            <button style="font-weight:bold;" onclick="location.href='InfiniteShreks'">
                Watch The Shrek Movie
            </button>
            <button style="font-weight:bold;" onclick="location.href='InfiniteColors'">
                Change Site Theme
            </button>
            <button style="font-weight:bold;" onclick="location.href='InfiniteTitles'">
                Change Site Title
            </button>
            <button style="font-weight:bold;" onclick="location.href='InfiniteLocators'">
                Get Doxxed
            </button>
            <button style="font-weight:bold;" onclick="location.href='InfiniteBlanks'">
                Open Any Site In About:Blank
            </button>
            <button style="font-weight:bold;" onclick="location.href='InfiniteAwesomes'">
                Cool URLs For Chrome
            </button>
        </div>
        <div id="chatToggle" class="dropdown-toggle headerbtn" style="right:595; top:14; position:absolute;">
            Chat
        </div>
        <div class="dropdown" id="chatDropdown">
            <button style="font-weight:bold;" onclick="location.href='InfiniteTalkers'">
                Padlet
            </button>
            <button style="font-weight:bold;" onclick="location.href='InfiniteChatters'">
                Website Chat
            </button>
            <button style="font-weight:bold;" onclick="location.href='InfiniteDiscords'">
                Live Discord Chat
            </button>
        </div>
        <div id="helpToggle" class="dropdown-toggle headerbtn" style="right:470; top:14; position:absolute;">
            Help/Support
        </div>
        <div style="right:400;" class="dropdown" id="helpDropdown">
            <button style="font-weight:bold;" onclick="location.href='InfiniteQuestions'">
                FAQ
            </button>
            <button style="font-weight:bold;" onclick="location.href='InfiniteIssues'">
                Report A Bug
            </button>
            <button style="font-weight:bold;" onclick="location.href='InfiniteErrors'">
                Check Error Codes
            </button>
        </div>
        <a class="headerbtn" style="right:400; top:14" href="InfiniteGamers">
            Games
        </a>
        <a class="headerbtn" style="right:330; top:14" href="InfiniteCheaters">
            Cheats
        </a>
        <a class="headerbtn" style="right:250; top:14" href="InfiniteUpdaters">
            Updates
        </a>
        <div id="downloadToggle" class="dropdown-toggle headerbtn" style="right:120; top:14; position:absolute;">
            Download Games
        </div>
        <div style="right:50; top:50px;" class="dropdown" id="downloadDropdown">
            <button style="font-weight:bold;" onclick="location.href='InfiniteMiners'">
                How To Download Minecraft
            </button>
            <button style="font-weight:bold;" onclick="location.href='InfiniteOpeners'">
                Download This Website
            </button>
            <button style="font-weight:bold;" onclick="location.href='https://downloadgames-14894445.codehs.me/ngon.html'">
                Download Ngon
            </button>
            <button style="font-weight:bold;" onclick="location.href='https://downloadgames-14894445.codehs.me/OVO.html'">
                Download 0v0
            </button>
        </div>
        <a class="contactme" style="right:0; top:10; margin-right:10px" href="InfiniteContacts">
            Contact Me
        </a>
    </header>
</strong>
<footer id="site-footer" style="bottom:-4; text-align:left">
    <p>Totally Made By Noah White And Not A Different Person.</p>
</footer>
<footer id="text-only-footer" style="background-color:transparent; text-align:right; bottom:-4">
  <p>Pissing Off Your Teachers Since 2024</p>
</footer>
`;
document.addEventListener("DOMContentLoaded", () => {
    const headerWrapper = document.createElement("div");
    headerWrapper.innerHTML = headerHTML;
    document.body.insertBefore(headerWrapper, document.body.firstChild);
    const appsToggle = document.getElementById('appsToggle');
    const appsDropdown = document.getElementById('appsDropdown');
    const chatToggle = document.getElementById('chatToggle');
    const chatDropdown = document.getElementById('chatDropdown');
    const downloadToggle = document.getElementById('downloadToggle');
    const downloadDropdown = document.getElementById('downloadDropdown');
    const helpToggle = document.getElementById('helpToggle');
    const helpDropdown = document.getElementById('helpDropdown');
    appsToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        appsDropdown.style.display = appsDropdown.style.display === 'flex' ? 'none' : 'flex';
        chatDropdown.style.display = 'none';
        downloadDropdown.style.display = 'none';
        helpDropdown.style.display = 'none';
    });
    chatToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        chatDropdown.style.display = chatDropdown.style.display === 'flex' ? 'none' : 'flex';
        appsDropdown.style.display = 'none';
        downloadDropdown.style.display = 'none';
        helpDropdown.style.display = 'none';
    });
    downloadToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        downloadDropdown.style.display = downloadDropdown.style.display === 'flex' ? 'none' : 'flex';
        appsDropdown.style.display = 'none';
        chatDropdown.style.display = 'none';
        helpDropdown.style.display = 'none';
    });
    helpToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        helpDropdown.style.display = helpDropdown.style.display === 'flex' ? 'none' : 'flex';
        appsDropdown.style.display = 'none';
        downloadDropdown.style.display = 'none';
        chatDropdown.style.display = 'none';
    });
    document.addEventListener('click', (e) => {
        if (!appsDropdown.contains(e.target) && !appsToggle.contains(e.target)) {
            appsDropdown.style.display = 'none';
        }
        if (!chatDropdown.contains(e.target) && !chatToggle.contains(e.target)) {
            chatDropdown.style.display = 'none';
        }
        if (!downloadDropdown.contains(e.target) && !downloadToggle.contains(e.target)) {
            downloadDropdown.style.display = 'none';
        }
        if (!helpDropdown.contains(e.target) && !helpToggle.contains(e.target)) {
            helpDropdown.style.display = 'none';
        }
    });
});