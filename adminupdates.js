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
const webhookURL = atob(n);
let lastSentKey = null;
let hasLoaded = false;
function sendToDiscord(message) {
    fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: message })
    }).catch(e => console.error("ERR#7 Discord Webhook Error:", e));
}
function addUpdate() {
    const contentEl = document.getElementById('newUpdate');
    const content = contentEl.value.trim();
    if (content) {
        push(updatesRef, {
            content,
            timestamp: Date.now()
        }).then(() => console.log("Update Added."));
        contentEl.value = '';
    }
}
function deleteUpdate(key) {
    remove(ref(db, 'updates/' + key));
    if (lastSentKey === key) lastSentKey = null;
}
function editUpdate(key, currentText) {
    const newText = prompt("Edit Update:", currentText);
    if (newText !== null && newText.trim() !== "") {
        update(ref(db, 'updates/' + key), {
            content: newText.trim()
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
        updates.slice(10).forEach(u => deleteUpdate(u.key));
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
document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById('newUpdate');
    if (input) {
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                addUpdate();
            }
        });
    }
});