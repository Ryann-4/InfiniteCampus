let CHAT_WEBHOOK, CHAT_USERNAME, CHAT_PASSWORD;
(function () {
  function decryptCaesar(base64Str, key) {
    try {
      const shifted = atob(base64Str);
      return [...shifted].map(c =>
        String.fromCharCode(c.charCodeAt(0) - key)
      ).join('');
    } catch {
      return '';
    }
  }
  function decryptBase64(base64Str) {
    try {
      return atob(base64Str);
    } catch {
      return '';
    }
  }
  CHAT_WEBHOOK = decryptCaesar(f, key);
  CHAT_USERNAME = decryptCaesar(a, key);
  CHAT_PASSWORD = decryptCaesar(b, key);
  window.USERNAME_NITRIX = decryptBase64(c);
  window.PASSWORD_NITRIX = decryptBase64(d);
})();
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
  update,
  remove
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";
const firebaseConfig = {
  apiKey: "Chat_Api_Key",
  authDomain: "website-chat-617b3.firebaseapp.com",
  databaseURL: "https://website-chat-617b3-default-rtdb.firebaseio.com",
  projectId: "website-chat-617b3",
  storageBucket: "website-chat-617b3.appspot.com",
  messagingSenderId: "633874571535",
  appId: "1:633874571535:web:089380d33aabaa9a4c5e7a"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messagesRef = ref(db, "messages");
const userId = "user_" + Math.random().toString(36).substr(2, 9);
const ADMIN_USERNAME = CHAT_USERNAME;
const ADMIN_PASSWORD = CHAT_PASSWORD;
const NITRIX_USERNAME = window.USERNAME_NITRIX;
const NITRIX_PASSWORD = window.PASSWORD_NITRIX;
const DISCORD_WEBHOOK = CHAT_WEBHOOK;
let loggedInUser = localStorage.getItem("chat_logged_in");
let isAdmin = loggedInUser === "hacker41";
let displayName = "";
if (loggedInUser === "hacker41") {
  displayName = "Hacker41 💎";
} else if (loggedInUser === "nitrix") {
  displayName = "Nitrix 🔵";
}
document.addEventListener("DOMContentLoaded", () => {
  if (loggedInUser) {
    document.getElementById("loginStatus").textContent = `Logged in as ${displayName}`;
    document.getElementById("nameInput").disabled = true;
    document.getElementById("nameInput").value = displayName;
    const loginContainer = document.getElementById("loginContainer");
    if (loginContainer) loginContainer.remove();
    const logoutBtn = document.createElement("button");
    logoutBtn.textContent = "Logout";
    logoutBtn.className = "button";
    logoutBtn.onclick = logout;
    document.getElementById("loginStatus").after(logoutBtn);
  }
});
window.login = function () {
  const enteredUser = document.getElementById("loginUser").value;
  const enteredPass = document.getElementById("loginPass").value;
  if (enteredUser === ADMIN_USERNAME && enteredPass === ADMIN_PASSWORD) {
    localStorage.setItem("chat_logged_in", "hacker41");
    location.reload();
  } else if (enteredUser === NITRIX_USERNAME && enteredPass === NITRIX_PASSWORD) {
    localStorage.setItem("chat_logged_in", "nitrix");
    location.reload();
  } else {
    alert("ERR#4 Incorrect credentials.");
  }
};
window.logout = function () {
  localStorage.removeItem("chat_logged_in");
  location.reload();
};
window.sendMessage = function () {
  const nameInput = document.getElementById("nameInput");
  const textInput = document.getElementById("messageInput");
  const rawName = nameInput.value.trim();
  if (!isAdmin && rawName === "Hacker41") {
    alert("ERR#6 You cannot use the reserved name 'Hacker41'.");
    return;
  }
  const name = displayName || rawName || "Anonymous";
  const text = textInput.value.trim();
  if (!text) return;
  const timestamp = new Date().toLocaleString();
  const message = {
    name,
    text,
    userId,
    author: loggedInUser || "anonymous",
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
  const author = data.author || "anonymous";
  const isOwnMessage = data.userId === userId;
  const isByHacker41 = author === "hacker41";
  const canEditOrDelete =
    loggedInUser === "hacker41" ||
    (loggedInUser === "nitrix" && !isByHacker41) ||
    (!loggedInUser && isOwnMessage);
  if (canEditOrDelete) {
    const controls = document.createElement("div");
    controls.className = "controls";
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "button";
    editBtn.onclick = () => {
      const newText = prompt("Edit message:", data.text);
      if (newText !== null) {
        update(ref(db, `messages/${key}`), { text: newText });
      }
    };
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "button";
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