import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
window.UPTAPI = (s);
const firebaseConfig = {
    apiKey: window.UPDAPI,
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
onValue(updatesRef, (snapshot) => {
    const updates = [];
    snapshot.forEach(child => {
        updates.push(child.val());
    });
    updates.sort((a, b) => b.timestamp - a.timestamp);
    const container = document.getElementById('updates');
    container.innerHTML = '';
    updates.slice(0, 10).forEach((update, index) => {
        const div = document.createElement('div');
        div.className = `update-box ${index % 2 === 0 ? 'r' : 'y'}`;
        div.innerHTML = `${index + 1}. ${update.content}`;
        container.appendChild(div);
    });
});