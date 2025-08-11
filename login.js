function decodeBase64Twice(str) {
    try {
        return atob(atob(str));
    } catch (e) {
        return "";
    }
}
const s = [
    { username: "UVd4aGJXRnNQU0V3T1RBeE5qaz0=", password: "Ulcxd1pHUXhOVGN4T1RnPQ==", key: "hacker41" },
    { username: "Tmprd1lqWnZjR0ZqYXk1amIyMHpPQT09", password: "ZEdobE56WXpZV2x0WVhOMFlXdzVZUT09", key: "nitrix" }
];
const loggedIn = localStorage.getItem("chat_logged_in");
if (loggedIn === "hacker41" || loggedIn === "nitrix") {
    window.location.href = atob(h);
}
function checkLogin() {
    const inputUser = document.getElementById("username").value.trim();
    const inputPass = document.getElementById("password").value;
    for (let cred of s) {
        if (decodeBase64Twice(cred.username) === inputUser &&
            decodeBase64Twice(cred.password) === inputPass) {
            localStorage.setItem("chat_logged_in", cred.key);
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