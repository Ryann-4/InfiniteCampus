function openGame() {
    var win = window.open();
    var url = "https://ryann-4.github.io/InfiniteCampus";
    if (win) {
        var iframe = win.document.createElement('iframe');
        iframe.style.width = "100vw";
        iframe.style.height = "100vh";
        iframe.style.border = "none";
        iframe.src = url;
        win.document.title = 'Infinite Campus';
        win.document.body.style.margin = "0"; 
        win.document.body.style.overflow = "hidden"; 
        win.document.body.appendChild(iframe);
    } else {
        alert("Err#1 Popup Blocked");
    }
}
function create() {
    var url = document.getElementById('input').value;
    var win = window.open();
    win.document.body.style.margin = '0';
    win.document.body.style.height = '100vh';
    var iframe = win.document.createElement('iframe');
    iframe.style.border = 'none';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.margin = '0';
    iframe.src = url;
    win.document.body.appendChild(iframe);
}
window.onload = function() {
    document.getElementById('input').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            create();
        }
    });
};