async function sendMessage() {
      const nameInput = document.getElementById("name").value.trim();
      const name = nameInput ? nameInput : "Website User";
      const message = document.getElementById("message").value.trim();
      const status = document.getElementById("status");
      if (!message) {
        status.textContent = "Message cannot be empty!";
        status.style.color = "orange";
        return;
      }
      const fullMessage = `**${name}**\n${message}`;
      const webhookURL = "https://discord.com/api/webhooks/1389334372707991822/rwD0_F_PBCrmgwBqihL6e1P0BIsQM_GjshpyTRM1OgWfArYqt4_lbBKS10sKwNK8C2FQ";
      try {
        const response = await fetch(webhookURL, {
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
          status.textContent = "❌ Failed to send message.";
          status.style.color = "red";
        }
      } catch (error) {
        status.textContent = "⚠️ Error sending message.";
        status.style.color = "red";
        console.error(error);
      }
    }