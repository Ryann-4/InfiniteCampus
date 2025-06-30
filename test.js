const headerHTML = `
<div class="popup2" id="popup">
            <div class="bar">
                <div style="text-align:center; font-size:25px; margin-top:-10px;"id="clocks">
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
                <a class="button" href="InfiniteColors">
                    Change Header/Footer Color
                </a>
                <br>
                <br>
                <br>
                <a class="button" href="InfinitePolls">
                    Take A Quick Survey
                </a>
                <br>
                <br>
                <br>
                <a class="button" href="InfiniteBypassers">
                    Open In About:Blank
                </a>
            </div>
            <div class="bar">
                <center>
                    <a class="headerbtn" href="https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&su=Infinite%20Campus%20Notification&to=infinitecodehs@gmail.com" style="margin-top:-15px; margin-left:-50px;font-size:15px">
                        Contact Me
                    </a>
                </center>
            </div>
        </div>
        <div class="settings-button" id="trigger">
            <img src="https://codehs.com/uploads/fdacfa996601fc09d8da4d63fd2ca986" alt="Icon">
        </div>
        <script src="popup.js">
        </script>
        <script src="clock.js">
        </script>        <!-- Header -->
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
                <a class="contactme" style="right:0; top:10; margin-right:10px" href="https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&su=Infinite%20Campus%20Notification&to=infinitecodehs@gmail.com" >
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