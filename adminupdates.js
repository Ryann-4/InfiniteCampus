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

// Your new Discord webhook URL encoded in Base64
const encryptedWebhook = "aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTM4OTcwNzcwMDQ1OTUzNjUyNC9tMlBJRkx0Z2l3V2RfZnJNZXhzU1dvTTVnZk00TnpPMWR4RjJBRGRqQThvY19-cksiMG8xWEUwQ1hpVEtFT3FxWWpXWm8=";
const webhookURL = atob(encryptedWebhook);

const sentToDiscord = new Set();

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
      timestamp: Date.now()
    }).then(() => console.log("Update added."));
    document.getElementById('newUpdate').value = '';
  }
}
function deleteUpdate(key) {
  remove(ref(db, 'updates/' + key));
  sentToDiscord.delete(key);
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

onValue(updatesRef, (snapshot) => {
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
    const div = document.createElement('div');
    div.className = `update-box ${index % 2 === 0 ? 'r' : 'y'}`;
    div.innerHTML = `
      <button class="button" onclick="editUpdate('${update.key}', \`${update.content.replace(/`/g, '\\`')}\`)">Edit</button>
      ${index + 1}. ${update.content}
      <button class="button" onclick="deleteUpdate('${update.key}')">Delete</button>
    `;
    container.appendChild(div);

    if (!sentToDiscord.has(update.key)) {
      sentToDiscord.add(update.key);
      sendToDiscord(`${index + 1}. ${update.content}`);
    }
  });
});
