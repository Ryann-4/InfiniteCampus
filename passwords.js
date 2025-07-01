// 🔐 Decrypt and assign VALID_CREDENTIALS
  let VALID_CREDENTIALS;
  (function () {
    const key = 5;
    const encrypted = "Jzc1ODVwZnFxbnh0c0VvdG1zeHl0c3hobXR0cXgzdHdsJz8lJzc1ODVwJzEPJSUlJSc5OTw4O0V4eXppanN5M3h0enltamZ4eXV0cXAzdHdsJz8lJzk5PDg7JzEPJSUlJSduc2tuc255amh0aWpteEVscmZucTNodHInPyUnbnNrbnNueWonMQ8lJSUlJzk9Njs2RXh5emlqc3kzeHR6eW1qZnh5dXRxcDN0d2wnPyUnOT02OzYnMQ8lJSUlJzo6Oj02RXh5emlqc3kzeHR6eW1qZnh5dXRxcDN0d2wnPyUnOjo6PTYn";

    function decrypt(base64Str, key) {
      try {
        const shifted = atob(base64Str);
        const decoded = [...shifted].map(c =>
          String.fromCharCode(c.charCodeAt(0) - key)
        ).join('');
        const jsonSafe = decoded.replace(/'/g, '"');
        return JSON.parse(jsonSafe);
      } catch (err) {
        console.error("Decryption failed:", err);
        return {};
      }
    }

    VALID_CREDENTIALS = decrypt(encrypted, key);
  })();

  // ✅ Login functionality
  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("loginBtn").addEventListener("click", checkCredentials);
    document.getElementById("username").addEventListener("keypress", handleKeyPress);
    document.getElementById("password").addEventListener("keypress", handleKeyPress);
  });

  function checkCredentials() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

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