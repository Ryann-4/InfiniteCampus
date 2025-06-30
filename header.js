const headerHTML = `
        <!-- Header -->
        <header id="site-header">
            <strong>
                <iframe class="weather"src="InfiniteForecasts">
                </iframe>
                <a href="InfiniteCampers">
                    <img class="logo" src="https://codehs.com/uploads/d3ca105004013f2dc047f4bc0f669f6a" alt="Campus" style="left:335" >
                </a>
                <a class="headerbtn" style="right:710; top:14" href="InfiniteAbouts">
                    About
                </a>
                <a class="headerbtn" style="right:650; top:14" href="InfiniteApps">
                    Apps
                </a>
                <a class="headerbtn" style="right:590; top:14" href="InfiniteTalkers" >
                    Chat
                </a>
                <a class="headerbtn" style="right:470; top:14" href="InfiniteSupport" >
                    Help/Support
                </a>
                <a class="headerbtn" style="right:400; top:14" href="InfiniteGamers" >
                    Games
                </a>
                <a class="headerbtn" style="right:330; top:14" href="InfiniteCheaters" >
                    Cheats
                </a>
                <a class="headerbtn" style="right:250; top:14" href="InfiniteUpdaters" >
                    Updates
                </a>
                <a class="headerbtn" style="right:120; top:14" href="InfiniteFiles" >
                    Download Games
                </a>
                <a class="contactme" style="right:0; top:10; margin-right:10px" href="InfiniteContacts" >
                    Contact Me
                </a>
            </strong>
        </header>
`;
document.addEventListener("DOMContentLoaded", () => {
  const headerWrapper = document.createElement("div");
  headerWrapper.innerHTML = headerHTML;
  document.body.insertBefore(headerWrapper, document.body.firstChild);
});