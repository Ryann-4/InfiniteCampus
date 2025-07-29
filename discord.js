let DISCORD_WEBHOOK_URL;
(function () {
    const key = 5;
    function decrypt(str, key) {
        try {
            const shifted = atob(str);
            return [...shifted].map(c =>
                String.fromCharCode(c.charCodeAt(0) - key)
            ).join('');
        } catch {
            return '';
        }
    }
    DISCORD_WEBHOOK_URL = decrypt(g, key);
})();
async function sendMessage() {
    const nameInput = document.getElementById("name").value.trim();
    const name = nameInput ? nameInput : "Website User";
    const message = document.getElementById("message").value.trim();
    const status = document.getElementById("status");
    if (!message) {
        status.textContent = "ERR#8 Message Cannot Be empty!";
        status.style.color = "orange";
        return;
    }
    const fullMessage = `**${name}**\n${message}`;
    try {
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: fullMessage })
        });
        if (response.ok) {
            status.textContent = "✅ Message Sent!";
            status.style.color = "lightgreen";
            document.getElementById("name").value = "";
            document.getElementById("message").value = "";
        } else {
            status.textContent = "ERR#7 ❌ Failed To Send Message.";
            status.style.color = "red";
        }
    } catch (error) {
        status.textContent = "ERR#7 ⚠️ Error Sending Message.";
        status.style.color = "orange";
    }
}