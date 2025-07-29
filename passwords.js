function base64Decode(str) {
    try {
        return atob(str);
    } catch {
        return '';
    }
}
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginBtn").addEventListener("click", checkCredentials);
    document.getElementById("username").addEventListener("keypress", handleKeyPress);
    document.getElementById("password").addEventListener("keypress", handleKeyPress);
});
function checkCredentials() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");
    const RU = base64Decode(l);
    if (username === j && password === k) {
        window.location.href = RU;
    } else {
        message.textContent = "Err#4 Username And/Or Password Is Incorrect";
        message.style.color = "red";
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
    }
}
function handleKeyPress(event) {
    if (event.key === "Enter") checkCredentials();
}