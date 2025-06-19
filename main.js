console.log('%cWelcome To The Console If You Do Not Know What You Are Doing, Close It, If You Do I Would Be Happy To Let You Develop The Website With Me infinitecodehs@gmail.com', 'color: purple; font-size: 24px; font-weight: bold;');
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
 document.addEventListener('DOMContentLoaded', function () {
    // Load and apply saved title
    const savedTitle = localStorage.getItem('pageTitle');
    if (savedTitle) {
      document.title = savedTitle;
    }
    // Load and apply saved favicon
    const savedFavicon = localStorage.getItem('customFavicon');
    if (savedFavicon) {
      const favicon = document.getElementById('dynamic-favicon');
      if (favicon) {
        favicon.href = savedFavicon;
      }
    }
  });