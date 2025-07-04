(function () {
  const encryptedUsername = "TWZocGp3OTY=";
  const encryptedPassword = "WGp1d3M2NzY1Jg==";
  const encryptedUsernameNitrix = "Tml0cml4";
  const encryptedPasswordNitrix = "RGFkZHlOaXRyaXg2OQ==";
  const encryptedApiKey = "QWl6YVN5QWd6NjZYNW9RRzZKdnJKamlWRVd3VEtJNFRsZnhBNHF3";
  function decryptCaesar(base64Str, key = 5) {
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
  window.CHAT_USERNAME = decryptCaesar(encryptedUsername);
  window.CHAT_PASSWORD = decryptCaesar(encryptedPassword);
  window.USERNAME_NITRIX = decryptBase64(encryptedUsernameNitrix);
  window.PASSWORD_NITRIX = decryptBase64(encryptedPasswordNitrix);
  window.API_KEY = decryptBase64(encryptedApiKey);
})();
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-analytics.js";
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
  apiKey: window.API_KEY,
  authDomain: "admin-chat-16fef.firebaseapp.com",
  projectId: "admin-chat-16fef",
  storageBucket: "admin-chat-16fef.firebasestorage.app",
  messagingSenderId: "887788597954",
  appId: "1:887788597954:web:2a5761195dfec6f077815b",
  measurementId: "G-BBPTHZB6NB"
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);
const messagesRef = ref(db, "messages");
const userId = "user_" + Math.random().toString(36).substr(2, 9);
const ADMIN_USERNAME = window.CHAT_USERNAME;
const ADMIN_PASSWORD = window.CHAT_PASSWORD;
const NITRIX_USERNAME = window.USERNAME_NITRIX;
const NITRIX_PASSWORD = window.PASSWORD_NITRIX;
let loggedInUser = localStorage.getItem("chat_logged_in");
let isAdmin = loggedInUser === "hacker41";
let displayName = "";
if (loggedInUser === "hacker41") {
  displayName = "Hacker41 💎";
} else if (loggedInUser === "nitrix") {
  displayName = "Nitrix 🔵";
}
document.addEventListener("DOMContentLoaded", () => {
  if (!loggedInUser) {
    document.getElementById("chatContainer").style.display = "none";
    return;
  }
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
  if (!loggedInUser) return;
  const nameInput = document.getElementById("nameInput");
  const textInput = document.getElementById("messageInput");
  const rawName = nameInput.value.trim();
  if (!isAdmin && rawName === "Hacker41") {
    alert("ERR#6 You cannot use the name 'Hacker41'.");
    return;
  }
  const name = displayName || rawName || "Anonymous";
  const text = textInput.value.trim();
  if (!text) return;
  const message = {
    name,
    text,
    userId,
    author: loggedInUser,
    timestamp: Date.now()
  };
  push(messagesRef, message);
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
if (loggedInUser) {
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
}
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