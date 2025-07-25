    let DISCORD_WEBHOOK_URL;
    (function () {
      const k = "bXl5dXg/NDRpbnhodHdpM2h0cjRmdW40fGpnbXR0cHg0Njg9Pjg4OTg8Nzw1PD4+Nj03NzR3fEk1ZEtkVUdId3JsfEd2bm1RO2o2VTVHTnhWUmRMb3htdX5ZV1I2VGxca0Z3XnZ5OWRxZ0dQWDY1eFB8U1A9SDdLVg==";
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
      DISCORD_WEBHOOK_URL = decrypt(k, key);
    })();
    async function sendMessage() {
      const nameInput = document.getElementById("name").value.trim();
      const name = nameInput ? nameInput : "Website User";
      const message = document.getElementById("message").value.trim();
      const status = document.getElementById("status");
      if (!message) {
        status.textContent = "ERR#8 Message cannot be empty!";
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
          status.textContent = "✅ Message sent!";
          status.style.color = "lightgreen";
          document.getElementById("name").value = "";
          document.getElementById("message").value = "";
        } else {
          status.textContent = "ERR#7 ❌ Failed to send message.";
          status.style.color = "red";
        }
      } catch (error) {
        status.textContent = "ERR#7 ⚠️ Error sending message.";
        status.style.color = "red";
      }
    }