const presenceCountEl = document.getElementById("presenceCount");
    async function fetchDiscordPresence() {
      presenceCountEl.textContent = "Loading presence count...";
      try {
        const response = await fetch(m);
        if (!response.ok) {
          throw new Error("ERR#13 Failed to fetch data: " + response.status);
        }
        const data = await response.json();
        if (Array.isArray(data.members) && data.members.length > 0) {
          const filteredMembers = data.members.filter(
            (member) => !o.includes(member.username)
          );
          presenceCountEl.textContent = `Online Members: ${filteredMembers.length}`;
        } else {
          presenceCountEl.textContent = "No members online.";
        }
      } catch (error) {
        presenceCountEl.textContent = "ERR#13 Error fetching presence count.";
        console.error(error);
      }
    }
    fetchDiscordPresence();
    setInterval(fetchDiscordPresence, 10000);