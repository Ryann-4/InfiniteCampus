
    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
    import { getDatabase, ref, onValue, push, remove, update } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

    const firebaseConfig = {
      apiKey: "Google_Api_Key",
      authDomain: "website-updates-485ea.firebaseapp.com",
      databaseURL: "https://website-updates-485ea-default-rtdb.firebaseio.com",
      projectId: "website-updates-485ea",
      storageBucket: "website-updates-485ea.appspot.com",
      messagingSenderId: "184900273791",
      appId: "1:184900273791:web:5a28c7ac05587b2f79a14a",
      measurementId: "G-VXNTBEKM3W"
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const updatesRef = ref(db, 'updates');

    const encryptedWebhook = "aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTM4OTcwNzcwMDQ1OTUzNjUyNC9tMlBJRkwtdGdpd1dkX2ZyTWV4c1NXb001Z2ZNNE56TzFkeEYyQWRqQThvY18tckswbzFYRTBDWGlUS0VPcXFZaldabw==";
    const webhookURL = atob(encryptedWebhook);

    const credentials = {
      hacker41: {
        username: atob("SGFja2VyNDE="),        
        password: atob("U2Vwcm4xMjEwIQ==")     
      },
      nitrix: {
        username: atob("Tml0cml4"),            
        password: atob("RGFkZHlOaXRyaXg2OQ==") 
      }
    };

    let loggedInUser = localStorage.getItem("loggedInUser");

    function login() {
      const u = document.getElementById('username').value;
      const p = document.getElementById('password').value;

      if (u === credentials.hacker41.username && p === credentials.hacker41.password) {
        localStorage.setItem("loggedInUser", "hacker41");
        location.reload();
      } else if (u === credentials.nitrix.username && p === credentials.nitrix.password) {
        localStorage.setItem("loggedInUser", "nitrix");
        location.reload();
      } else {
        alert("Invalid credentials");
      }
    }

    function logout() {
      localStorage.removeItem("loggedInUser");
      location.reload();
    }

    function sendToDiscord(message) {
      fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message })
      }).catch(e => console.error("Discord webhook error:", e));
    }

    function addUpdate() {
      const content = document.getElementById('newUpdate').value.trim();
      if (content) {
        push(updatesRef, {
          content,
          timestamp: Date.now(),
          author: loggedInUser || "anonymous"
        });
        document.getElementById('newUpdate').value = '';
      }
    }

    function deleteUpdate(key) {
      remove(ref(db, 'updates/' + key));
      if (lastSentKey === key) lastSentKey = null;
    }

    function editUpdate(key, currentText) {
      const newText = prompt("Edit update:", currentText);
      if (newText && newText.trim() !== "") {
        update(ref(db, 'updates/' + key), {
          content: newText.trim(),
          timestamp: Date.now()
        });
      }
    }

    window.addUpdate = addUpdate;
    window.deleteUpdate = deleteUpdate;
    window.editUpdate = editUpdate;
    window.login = login;

    let lastSentKey = null;

    onValue(updatesRef, (snapshot) => {
      const updates = [];
      snapshot.forEach(child => {
        updates.push({ key: child.key, ...child.val() });
      });
      updates.sort((a, b) => b.timestamp - a.timestamp);
      if (updates.length > 10) {
        updates.slice(10).forEach(u => deleteUpdate(u.key));
      }

      const container = document.getElementById('updates');
      container.innerHTML = '';
      updates.slice(0, 10).forEach((update, index) => {
        const canEdit =
          loggedInUser === "hacker41" ||
          (loggedInUser === "nitrix" && update.author !== "hacker41");

        const div = document.createElement('div');
        div.className = `update-box ${index % 2 === 0 ? 'r' : 'y'}`;
        div.innerHTML = `
          ${canEdit ? `<button class="button" onclick="editUpdate('${update.key}', \`${update.content.replace(/`/g, '\\`')}\`)">Edit</button>` : ''}
          ${index + 1}. ${update.content}
          ${canEdit ? `<button class="button" onclick="deleteUpdate('${update.key}')">Delete</button>` : ''}
        `;
        container.appendChild(div);
      });

      if (updates.length > 0 && updates[0].key !== lastSentKey) {
        lastSentKey = updates[0].key;
        sendToDiscord(updates[0].content);
      }
    });

    // Show current login state
    if (loggedInUser) {
      const label = loggedInUser === "nitrix" ? "🔵Nitrix" : "💎Hacker41";
      document.getElementById('auth').innerHTML = `<button onclick="logout()">Logout</button>`;
      document.getElementById('loggedInAs').innerText = `Logged in as: ${label}`;
      window.logout = logout;
    }