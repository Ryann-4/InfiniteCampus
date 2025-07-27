    function decodeBase64(str) {
      try {
        return atob(str);
      } catch (e) {
        return "";
      }
    }
    function checkLogin() {
      const inputUser = document.getElementById("username").value.trim();
      const inputPass = document.getElementById("password").value;
      const valid = p.some(user =>
        decodeBase64(user.username) === inputUser &&
        decodeBase64(user.password) === inputPass
      );
      if (valid) {
        window.location.href = decodeBase64(h);
      } else {
        alert("ERR#4 Invalid Username Or Password.");
      }
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        checkLogin();
      }
    });