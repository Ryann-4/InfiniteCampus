import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";

// Firebase config
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const updatesRef = ref(db, 'updates');

// 🔐 Encrypted Discord Webhook URL (Base64)
const encryptedWebhook = "aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTM4OTcwMzQ0OTY0MTIyNjMzMC9SWXBpTGdqNzhRTk81RDZ4Yld4cVZJNDUtb2xIY00yanQ0WEtFZndxbGJYbjR2NkZFQWlWUVpwd0wxMFZSOGtXM2lObA==";

// Decode webhook
const webhookURL = atob(encryptedWebhook);

// Track timestamps to avoid duplicate Discord messages
const sentTimestamps = new Set();

// Send a message to Discord
function sendToDiscord(message) {
  fetch(webhookURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: message })
  }).catch(err => console.error("Failed to send to Discord:", err));
}

// Load updates and send/display
onValue(updatesRef, (snapshot) => {
  const updates = [];
  snapshot.forEach(child => {
    const data = child.val();
    updates.push(data);
  });

  updates.sort((a, b) => b.timestamp - a.timestamp);

  const container = document.getElementById('updates');
  container.innerHTML = '';

  updates.slice(0, 10).forEach((update, index) => {
    const div = document.createElement('div');
    div.className = `update-box ${index % 2 === 0 ? 'r' : 'y'}`;
    div.innerHTML = `${index + 1}. ${update.content}`;
    container.appendChild(div);

    // Send to Discord only once per unique timestamp
    if (update.timestamp && !sentTimestamps.has(update.timestamp)) {
      sentTimestamps.add(update.timestamp);
      sendToDiscord(`${index + 1}. ${update.content}`);
    }
  });
});