    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
    import { getDatabase, ref, push, onChildAdded, onChildChanged, onChildRemoved, update, remove } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";
    const firebaseConfig = {
      apiKey: "Chat_Api_Key",
      authDomain: "website-chat-617b3.firebaseapp.com",
      databaseURL: "https://website-chat-617b3-default-rtdb.firebaseio.com",
      projectId: "website-chat-617b3",
      storageBucket: "website-chat-617b3.firebasestorage.app",
      messagingSenderId: "633874571535",
      appId: "1:633874571535:web:089380d33aabaa9a4c5e7a"
    };
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const messagesRef = ref(db, "messages");
    const userId = "user_" + Math.random().toString(36).substr(2, 9);
    let isAdmin = false;
    const ADMIN_USERNAME = "Chat_Username";
    const ADMIN_PASSWORD = "Chat_Password";
    const DISCORD_WEBHOOK = "Chat_Webhook";
    window.login = function () {
      const enteredUser = document.getElementById("loginUser").value;
      const enteredPass = document.getElementById("loginPass").value;
      if (enteredUser === ADMIN_USERNAME && enteredPass === ADMIN_PASSWORD) {
        isAdmin = true;
        document.getElementById("loginStatus").textContent = "Logged in as Hacker41 ⭐";
        document.getElementById("loginStatus").classList.add("admin");
        document.getElementById("nameInput").disabled = true;
        document.getElementById("nameInput").value = "Hacker41 ⭐";
        document.getElementById("loginUser").value = "";
        document.getElementById("loginPass").value = "";
      } else {
        alert("Incorrect credentials.");
      }
    };
    window.sendMessage = function () {
      const nameInput = document.getElementById("nameInput");
      const textInput = document.getElementById("messageInput");
      const name = isAdmin ? "Hacker41 ⭐" : nameInput.value.trim() || "Anonymous";
      const rawName = nameInput.value.trim();
      if (!isAdmin && rawName === "Hacker41") {
        alert("You cannot use the reserved name 'Hacker41'.");
        return;
      }
      const text = textInput.value.trim();
      if (!text) return;
      const timestamp = new Date().toLocaleString();
      const message = {
        name,
        text,
        userId,
        timestamp: Date.now()
      };
      push(messagesRef, message);
      fetch(DISCORD_WEBHOOK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `**${name}** @ \`${timestamp}\`\n${text}`
        })
      }).catch(console.error);
      if (!isAdmin) nameInput.value = "";
      textInput.value = "";
    };
    function renderMessage(key, data) {
      const container = document.createElement("div");
      container.className = "message";
      container.id = key;
      const meta = document.createElement("div");
      meta.className = "meta";
      meta.textContent = `${data.name} @ ${new Date(data.timestamp).toLocaleTimeString()}`;
      const text = document.createElement("div");
      text.className = "text";
      text.textContent = data.text;
      container.appendChild(meta);
      container.appendChild(text);
      if (isAdmin || data.userId === userId) {
        const controls = document.createElement("div");
        controls.className = "controls";
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => {
          const newText = prompt("Edit message:", data.text);
          if (newText !== null) {
            update(ref(db, `messages/${key}`), { text: newText });
          }
        };
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => remove(ref(db, `messages/${key}`));
        controls.appendChild(editBtn);
        controls.appendChild(deleteBtn);
        container.appendChild(controls);
      }
      return container;
    }
    onChildAdded(messagesRef, (snapshot) => {
      const msgEl = renderMessage(snapshot.key, snapshot.val());
      document.getElementById("messages").appendChild(msgEl);
    });
    onChildChanged(messagesRef, (snapshot) => {
      const updated = renderMessage(snapshot.key, snapshot.val());
      const old = document.getElementById(snapshot.key);
      if (old) old.replaceWith(updated);
    });
    onChildRemoved(messagesRef, (snapshot) => {
      const el = document.getElementById(snapshot.key);
      if (el) el.remove();
    });
    document.getElementById("loginUser").addEventListener("keydown", (e) => {
      if (e.key === "Enter") login();
    });
    document.getElementById("loginPass").addEventListener("keydown", (e) => {
      if (e.key === "Enter") login();
    });
    document.getElementById("messageInput").addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });