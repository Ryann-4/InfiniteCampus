function openGame(url) {
    var win = window.open();
    if (win) {
        var iframe = win.document.createElement('iframe');
        iframe.style.width = "100vw";
        iframe.style.height = "100vh";
        iframe.style.border = "none";
        iframe.src = url;
        win.document.title = "Infinite Campus";
        win.document.body.style.margin = "0"; 
        win.document.body.style.overflow = "hidden"; 
        win.document.body.appendChild(iframe);
    } else {
        alert("Err#1 Popup Blocked");
    }
}
document.getElementById('openInfiniteCampus').addEventListener('click', () => {
    openGame('https://infinitecampus.xyz', 'Infinite Campus');
});
document.getElementById('openCustomUrl').addEventListener('click', () => {
    let url = document.getElementById('customUrl').value.trim();
    if (!url) {
        alert('Please Enter A URL.');
        return;
    }
    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    }
    try {
        new URL(url);
        openGame(url, url);
    } catch {
        alert('Invalid URL. Please Enter A Valid URL.');
    }
});