document.addEventListener('DOMContentLoaded', function () {
  const titleInput = document.getElementById('titleInput');
  const uploader = document.getElementById('faviconUploader');
  const resetFaviconBtn = document.getElementById('resetFavicon');
  const resetTitleBtn = document.getElementById('resetTitleBtn');
  const preview = document.getElementById('preview');
  const favicon = document.getElementById('dynamic-favicon');
  const storageKey = 'customFavicon';

  // Load saved title
  const savedTitle = localStorage.getItem('pageTitle');
  if (savedTitle) {
    document.title = savedTitle;
    titleInput.value = savedTitle;
  }

  titleInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      changeTitle();
    }
  });

  const setTitleBtn = document.getElementById('setTitleBtn');
  setTitleBtn.addEventListener('click', changeTitle);

  resetTitleBtn.addEventListener('click', resetTitle);

  // Load saved favicon
  const savedFavicon = localStorage.getItem(storageKey);
  if (savedFavicon) {
    applyFavicon(savedFavicon);
  }

  uploader.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      const dataURL = e.target.result;
      applyFavicon(dataURL);
      localStorage.setItem(storageKey, dataURL);
    };
    reader.readAsDataURL(file);
  });

  resetFaviconBtn.addEventListener('click', resetFavicon);

  function changeTitle() {
    const newTitle = titleInput.value.trim();
    if (newTitle) {
      document.title = newTitle;
      localStorage.setItem('pageTitle', newTitle);
    }
  }

  function resetTitle() {
    titleInput.value = '';
    document.title = 'Infinite Campus';  // Or whatever default title you want
    localStorage.removeItem('pageTitle');
  }

  function applyFavicon(dataURL) {
    favicon.href = dataURL;
    preview.src = dataURL;
    preview.style.display = 'block';
  }

  function resetFavicon() {
    localStorage.removeItem(storageKey);
    favicon.href = 'https://codehs.com/uploads/f111a37947de2cea81db858094c04f2d';
    preview.src = '';
    preview.style.display = 'none';
  }
});