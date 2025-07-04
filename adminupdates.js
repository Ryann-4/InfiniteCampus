import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, onValue, push, remove, update } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "Google_Api_Key",
  authDomain: "website-updates-485ea.firebaseapp.com",
  databaseURL: "https://website-updates-485ea-default-rtdb.firebaseio.com",
  projectId: "website-updates-485ea",
  storageBucket: "website-updates-485ea.firebasestorage.app",
  messagingSenderId: "184900273791",
  appId: "1:184900273791:web:5a28c7ac05587b2f79a14a",
  measurementId: "G-VXNTBEKM3W"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const updatesRef = ref(db, 'updates');

const encryptedWebhook = "aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTM4OTcwNzcwMDQ1OTUzNjUyNC9tMlBJRkwtdGdpd1dkX2ZyTWV4c1NXb001Z2ZNNE56TzFkeEYyQWRqQThvY18tckswbzFYRTBDWGlUS0VPcXFZaldabw==";
const webhookURL = atob(encryptedWebhook);

// Base64 credentials
const credentials = {
  "SGFja2VyNDE=": "U2Vwcm4xMjEwIQ==",  // Hacker41 / Seprn1210!
  "Tml0cml4": "RGFkZHlOaXRyaXg2OQ=="   // Nitrix / DaddyNitrix69
};

let currentUser = null;
let lastSentKey = null;
let hasLoaded = false;

function sendToDiscord(message) {
  fetch(webhookURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: message })
  }).catch(e => console.error("Discord webhook error:", e));
}

function checkLogin() {
  const usernameInput = document.getElementById('usernameInput').value.trim();
  const passwordInput = document.getElementById('passwordInput').value.trim();
  const encodedUser = btoa(usernameInput);
  const encodedPass = btoa(passwordInput);

  if (credentials[encodedUser] === encodedPass) {
    localStorage.setItem('loggedInUser', usernameInput);
    location.reload();
  } else {
    alert("Invalid username or password.");
  }
}

function logout() {
  localStorage.removeItem('loggedInUser');
  location.reload();
}

function addUpdate() {
  const content = document.getElementById('newUpdate').value.trim();
  if (content && currentUser) {
    push(updatesRef, {
      content,
      user: currentUser,
      timestamp: Date.now()
    }).then(() => console.log("Update added."));
    document.getElementById('newUpdate').value = '';
  }
}

function deleteUpdate(key) {
  remove(ref(db, 'updates/' + key));
  if (lastSentKey === key) lastSentKey = null;
}

function editUpdate(key, currentText) {
  const newText = prompt("Edit update:", currentText);
  if (newText !== null && newText.trim() !== "") {
    update(ref(db, 'updates/' + key), {
      content: newText.trim(),
      timestamp: Date.now()
    });
  }
}

window.addUpdate = addUpdate;
window.deleteUpdate = deleteUpdate;
window.editUpdate = editUpdate;
window.logout = logout;
window.checkLogin = checkLogin;

// Load login state
currentUser = localStorage.getItem('loggedInUser');

// DOM control
function updateUIBasedOnLogin() {
  const isLoggedIn = !!currentUser;
  document.getElementById('loginContainer').style.display = isLoggedIn ? 'none' : 'block';
  document.getElementById('chatContainer').style.display = isLoggedIn ? 'block' : 'none';
  document.getElementById('logoutBtn').style.display = isLoggedIn ? 'inline-block' : 'none';
}

updateUIBasedOnLogin();

onValue(updatesRef, (snapshot) => {
  if (!currentUser) return; // restrict view

  const updates = [];
  snapshot.forEach(child => {
    updates.push({ key: child.key, ...child.val() });
  });
  updates.sort((a, b) => b.timestamp - a.timestamp);

  if (updates.length > 10) {
    updates.slice(10).forEach(u => {
      deleteUpdate(u.key);
    });
  }

  const container = document.getElementById('updates');
  container.innerHTML = '';
  updates.slice(0, 10).forEach((update, index) => {
    const symbol = update.user === "Hacker41" ? "💎" : update.user === "Nitrix" ? "🔵" : "";
    const div = document.createElement('div');
    div.className = `update-box ${index % 2 === 0 ? 'r' : 'y'}`;
    div.innerHTML = `
      <div><strong>${update.user} ${symbol}</strong></div>
      ${index + 1}. ${update.content}
      <br>
      <button class="button" onclick="editUpdate('${update.key}', \`${update.content.replace(/`/g, '\\`')}\`)">Edit</button>
      <button class="button" onclick="deleteUpdate('${update.key}')">Delete</button>
    `;
    container.appendChild(div);
  });

  if (updates.length > 0) {
    const firstUpdate = updates[0];
    if (hasLoaded && firstUpdate.key !== lastSentKey) {
      lastSentKey = firstUpdate.key;
      sendToDiscord(firstUpdate.content);
    } else if (!hasLoaded) {
      lastSentKey = firstUpdate.key;
      hasLoaded = true;
    }
  }
});

// Key listeners
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (!currentUser) {
      checkLogin();
    } else if (document.activeElement.id === "newUpdate") {
      addUpdate();
    }
  }
});
