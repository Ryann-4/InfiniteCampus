function showPopup() {
    document.getElementById("popup").style.display = "block";
}
function closePopup() {
    document.getElementById("popup").style.display = "none";
}
function openGame() {
    var win = window.open();
    var url = "https://bbc-13099620.codehs.me";
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
    document.getElementById("popup").style.display = "none";
}