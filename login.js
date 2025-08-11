function decodeBase64Twice(str) {
    try {
        return atob(atob(str));
    } catch (e) {
        return "";
    }
}
const loggedIn = localStorage.getItem("chat_logged_in");
if (loggedIn === "hacker41" || loggedIn === "nitrix") {
    window.location.href = atob(h);
}
function checkLogin() {
    const inputUser = document.getElementById("usr").value.trim();
    const inputPass = document.getElementById("psw").value;
    for (let cred of s) {
        if (decodeBase64Twice(cred.usr) === inputUser &&
            decodeBase64Twice(cred.psw) === inputPass) {
            localStorage.setItem("chat_logged_in", decodeBase64Twice(cred.KY));
            window.location.href = atob(h);
            return;
        }
    }
    alert("ERR#4 Invalid Username Or Password.");
}
document.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        checkLogin();
    }
});