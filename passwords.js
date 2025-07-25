function base64Decode(str) {
  try {
    return atob(str);
  } catch {
    return '';
  }
}
const n = atob("aW5maW5pdGVjb2RlaHNAZ21haWwuY29t");
const o = atob("aW5maW5pdGU=");
const p = "SW5maW5pdGVTZWNyZXRQYWdlcw==";
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("loginBtn").addEventListener("click", checkCredentials);
  document.getElementById("username").addEventListener("keypress", handleKeyPress);
  document.getElementById("password").addEventListener("keypress", handleKeyPress);
});
function checkCredentials() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("message");
  const redirectUrl = base64Decode(p);
  if (username === n && password === o) {
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