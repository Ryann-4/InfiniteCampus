function unlock(str) {
    try {
        return atob(str);
    } catch {
        return '';
    }
}
function unlockTwice(str) {
    try {
        return atob(atob(str));
    } catch {
        return "";
    }
}
document.addEventListener("DOMContentLoaded", function () {
    const loggedIn = localStorage.getItem("chat_logged_in");
    if (loggedIn === "hacker41" || loggedIn === "nitrix") {
        window.location.href = unlock(l);
        return;
    }
    document.getElementById("loginBtn").addEventListener("click", runAuth);
    document.getElementById("username").addEventListener("keypress", handleEnter);
    document.getElementById("password").addEventListener("keypress", handleEnter);
});
function runAuth() {
    const enteredUser = document.getElementById("username").value.trim();
    const enteredPass = document.getElementById("password").value.trim();
    const msgBox = document.getElementById("message");
    const redirectURL = unlock(l);
    for (let cred of r) {
        if (unlockTwice(cred.usr) === enteredUser &&
            unlockTwice(cred.psw) === enteredPass) {
            localStorage.setItem("chat_logged_in", unlockTwice(cred.KY));
            window.location.href = redirectURL;
            return;
        }
    }
    msgBox.textContent = "Err#4 Username And/Or Password Is Incorrect";
    msgBox.style.color = "red";
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
}
function handleEnter(event) {
    if (event.key === "Enter") runAuth();
}