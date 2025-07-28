function showPopup() {
    document.getElementById("popups").style.display = "block";
}
function closePopup() {
    document.getElementById("popups").style.display = "none";
}
function openGame() {
    var win = window.open();
    var url = "https://ryann-4.github.io/InfiniteCampus";
    if (win) {
        var iframe = win.document.createElement('iframe');
        iframe.style.width = "100vw";
        iframe.style.height = "100vh";
        iframe.style.border = "none";
        iframe.src = url;
        win.document.body.style.margin = "0"; 
        win.document.body.style.overflow = "hidden"; 
        win.document.body.appendChild(iframe);
    } else {
        alert("Err#1 Popup Blocked");
    }
}
function closeAndRedirect() {
    openGame();
    window.close();
}
function keepOpenAndRedirect() {
    openGame();
    document.getElementById("popups").style.display = "none";
}