const presenceCountEl = document.getElementById("presenceCount");
    async function fetchDiscordPresence() {
      presenceCountEl.textContent = "Loading Presence Count...";
      try {
        const response = await fetch(m);
        if (!response.ok) {
          throw new Error("ERR#13 Failed To Fetch Data: " + response.status);
        }
        const data = await response.json();
        if (Array.isArray(data.members) && data.members.length > 0) {
          const filteredMembers = data.members.filter(
            (member) => !o.includes(member.username)
          );
          presenceCountEl.textContent = `Online Members: ${filteredMembers.length}`;
        } else {
          presenceCountEl.textContent = "No Members Online.";
        }
      } catch (error) {
        presenceCountEl.textContent = "ERR#13 Error Fetching Presence Count.";
        console.error(error);
      }
    }
    fetchDiscordPresence();
    setInterval(fetchDiscordPresence, 10000);