const encryptedUsers = [
      {
        username: "SGFja2VyNDE=",
        password: "U2Vwcm4xMjEwIQ=="
      },
      {
        username: "Tml0cml4",
        password: "RGFkZHlOaXRyaXg2OQ=="
      }
    ];
    const l = "SW5maW5pdGVBZG1pblVwZGF0ZXJz";
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
      const valid = encryptedUsers.some(user =>
        decodeBase64(user.username) === inputUser &&
        decodeBase64(user.password) === inputPass
      );
      if (valid) {
        window.location.href = decodeBase64(l);
      } else {
        alert("ERR#4 Invalid username or password.");
      }
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        checkLogin();
      }
    });