document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginBtn").addEventListener("click", checkCredentials);
    document.getElementById("username").addEventListener("keypress", handleKeyPress);
    document.getElementById("password").addEventListener("keypress", handleKeyPress);
});
function checkCredentials() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var message = document.getElementById("message");
    if (VALID_CREDENTIALS[username] === password) {
        window.location.href = "InfiniteSecretPages";
    } else {
        message.textContent = "Err#4 Username and/or password is incorrect";
        message.style.color = "red";
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";
    }
}
function handleKeyPress(event) {
    if (event.key === "Enter") {
        checkCredentials();
    }
}