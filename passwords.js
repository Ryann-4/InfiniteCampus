function base64Decode(str) {
  try {
    return atob(str);
  } catch {
    return '';
  }
}
const VALID_USERNAME = atob("aW5maW5pdGVjb2RlaHNAZ21haWwuY29t");
const VALID_PASSWORD = atob("aW5maW5pdGU=");
const REDIRECT_URL_BASE64 = "SW5maW5pdGVTZWNyZXRQYWdlcw==";
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("loginBtn").addEventListener("click", checkCredentials);
  document.getElementById("username").addEventListener("keypress", handleKeyPress);
  document.getElementById("password").addEventListener("keypress", handleKeyPress);
});
function checkCredentials() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("message");
  const redirectUrl = base64Decode(REDIRECT_URL_BASE64);
  if (username === VALID_USERNAME && password === VALID_PASSWORD) {
    window.location.href = redirectUrl;
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