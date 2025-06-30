window.addEventListener('DOMContentLoaded', () => {
  // Inject the HTML
  const popupHTML = `
    <div class="popup2" id="popup">
      <div class="bar">
        <div style="text-align:center; font-size:25px; margin-top:-10px;" id="clocks">
          --:--:-- --
        </div>
      </div>
      <div class="text">
        <p class="txt">Settings</p>
        <br>
        <a class="button" href="InfiniteTitles">Tab Cloaking</a>
        <br><br><br>
        <a class="button" href="InfiniteColors">Change Header/Footer Color</a>
        <br><br><br>
        <a class="button" href="InfinitePolls">Take A Quick Survey</a>
        <br><br><br>
        <a class="button" href="InfiniteBypassers">Open In About:Blank</a>
      </div>
      <div class="bar">
        <center>
          <a class="headerbtn" href="InfiniteContacts" style="margin-top:-15px; margin-left:-50px; font-size:15px;">
            Contact Me
          </a>
        </center>
      </div>
    </div>
    <div class="settings-button" id="trigger">
      <img src="https://codehs.com/uploads/fdacfa996601fc09d8da4d63fd2ca986" alt="Icon">
    </div>
    <center>
  `;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = popupHTML;
  document.body.appendChild(wrapper);

  // Attach popup.js behavior
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
});
