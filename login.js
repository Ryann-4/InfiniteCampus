(function() {
    const user = localStorage.getItem("chat_logged_in");
    if (user !== "hacker41" && user !== "nitrix") {
        window.location.href = "InfinitePasswords";
    }
})();