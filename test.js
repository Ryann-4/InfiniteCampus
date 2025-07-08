const headerHTML = `
<!-- Header -->
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
        background: inherit; /* Inherits from header */
    }

    .dropdown button {
        background: transparent;
        border: none;
        padding: 10px 15px;
        text-align: left;
        cursor: pointer;
        font-weight: bold;
        color: white;
        transition: background 0.3s;
    }

    .dropdown button:hover {
        background: rgba(255, 255, 255, 0.1);
    }

    .dropdown-toggle {
        cursor: pointer;
    }
</style>

<header id="site-header">
        <iframe class="weather" src="InfiniteForecasts">
        </iframe>
        <a href="https://ryann-4.github.io/InfiniteCampus">
            <img class="logo" src="https://codehs.com/uploads/d3ca105004013f2dc047f4bc0f669f6a" alt="Campus" style="left:335">
        </a>
        <a class="headerbtn" style="right:710; top:14" href="InfiniteAbouts">
            About
        </a>
        <a class="headerbtn" style="right:650; top:14" href="InfiniteApps">
            Apps
        </a>
        <div class="dropdown-toggle headerbtn" style="right:590; top:14; position:absolute;">
            Chat
        </div>
        <div class="dropdown" id="chatDropdown">
            <button onclick="location.href='InfiniteChats'">
                General Chat
            </button>
            <button onclick="location.href='InfiniteAdminChats'">
                Admin Chat
            </button>
            <button onclick="location.href='InfiniteImageChats'">
                Image Chat
            </button>
        </div>
        <a class="headerbtn" style="right:470; top:14" href="InfiniteSupport">
            Help/Support
        </a>
        <a class="headerbtn" style="right:400; top:14" href="InfiniteGamers">
            Games
        </a>
        <a class="headerbtn" style="right:330; top:14" href="InfiniteCheaters">
            Cheats
        </a>
        <a class="headerbtn" style="right:250; top:14" href="InfiniteUpdaters">
            Updates
        </a>
        <a class="headerbtn" style="right:120; top:14" href="InfiniteFiles">
            Download Games
        </a>
        <a class="contactme" style="right:0; top:10; margin-right:10px" href="InfiniteContacts">
            Contact Me
        </a>
</header>
`;

document.addEventListener("DOMContentLoaded", () => {
  const headerWrapper = document.createElement("div");
  headerWrapper.innerHTML = headerHTML;
  document.body.insertBefore(headerWrapper, document.body.firstChild);

  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const dropdownMenu = document.getElementById('chatDropdown');

  dropdownToggle.addEventListener('click', () => {
    dropdownMenu.style.display = dropdownMenu.style.display === 'flex' ? 'none' : 'flex';
  });

  document.addEventListener('click', (e) => {
    if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.style.display = 'none';
    }
  });
});