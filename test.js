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
    }

    .dropdown button {
        border: none;
        padding: 10px;
        text-align: left;
        cursor: pointer;
        font-weight: bold;
        color: white;
        transition: background 0.3s;
    }

    .dropdown button:hover {
        opacity: 0.85;
    }

    .dropdown-toggle {
        cursor: pointer;
    }
</style>

<header id="site-header" style="background: #222; color: white;">
    <strong>
        <iframe class="weather" src="InfiniteForecasts"></iframe>

        <a href="https://ryann-4.github.io/InfiniteCampus">
            <img class="logo" src="https://codehs.com/uploads/d3ca105004013f2dc047f4bc0f669f6a" alt="Campus" style="left:335">
        </a>

        <a class="headerbtn" style="right:710; top:14" href="InfiniteAbouts">About</a>
        <a class="headerbtn" style="right:650; top:14" href="InfiniteApps">Apps</a>

        <div class="dropdown-toggle headerbtn" style="right:590; top:14; position:absolute;">Chat ▼</div>
        <div class="dropdown" id="chatDropdown">
            <button onclick="location.href='InfiniteChatters'">Website Chat</button>
            <button onclick="location.href='InfiniteTalkers'">Padlet</button>
            <button onclick="location.href='InfiniteDiscords'">Live Discord Chat</button>
        </div>

        <a class="headerbtn" style="right:470; top:14" href="InfiniteSupport">Help/Support</a>
        <a class="headerbtn" style="right:400; top:14" href="InfiniteGamers">Games</a>
        <a class="headerbtn" style="right:330; top:14" href="InfiniteCheaters">Cheats</a>
        <a class="headerbtn" style="right:250; top:14" href="InfiniteUpdaters">Updates</a>
        <a class="headerbtn" style="right:120; top:14" href="InfiniteFiles">Download Games</a>
        <a class="contactme" style="right:0; top:10; margin-right:10px" href="InfiniteContacts">Contact Me</a>
    </strong>
</header>
`;

document.addEventListener("DOMContentLoaded", () => {
  const headerWrapper = document.createElement("div");
  headerWrapper.innerHTML = headerHTML;
  document.body.insertBefore(headerWrapper, document.body.firstChild);

  // Dropdown logic
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const dropdownMenu = document.getElementById('chatDropdown');

  dropdownToggle.addEventListener('click', () => {
    dropdownMenu.style.display = dropdownMenu.style.display === 'flex' ? 'none' : 'flex';
  });

  // Sync dropdown background with header background
  const headerColor = getComputedStyle(document.getElementById('site-header')).backgroundColor;
  dropdownMenu.style.backgroundColor = headerColor;
  const buttons = dropdownMenu.querySelectorAll('button');
  buttons.forEach(btn => {
    btn.style.backgroundColor = headerColor;
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
      dropdownMenu.style.display = 'none';
    }
  });
});
