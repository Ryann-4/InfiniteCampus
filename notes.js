import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyBvbTQcsL1DoipWlO0ckApzkwCZgxBYbzY",
  authDomain: "notes-27f22.firebaseapp.com",
  databaseURL: "https://notes-27f22-default-rtdb.firebaseio.com",
  projectId: "notes-27f22",
  storageBucket: "notes-27f22.appspot.com",
  messagingSenderId: "424229778181",
  appId: "1:424229778181:web:fa531219ed165346fa7d6c",
  measurementId: "G-834FYV6VTR"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

// Safe lookups
const noteInput = document.getElementById('noteInput');
const saveBtn = document.getElementById('saveBtn');
const notesContainer = document.getElementById('notesContainer');

// Save note if elements exist
function saveNote() {
  if (!noteInput) return;
  const text = noteInput.value.trim();
  if (text) {
    push(ref(db, 'notes'), { text });
    noteInput.value = '';
  }
}

// Event listeners only if elements exist
if (saveBtn && noteInput) {
  saveBtn.addEventListener('click', saveNote);
  noteInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveNote();
    }
  });
}

// Always show notes
onValue(ref(db, 'notes'), (snapshot) => {
  if (!notesContainer) return;
  notesContainer.innerHTML = '';

  snapshot.forEach((child) => {
    const note = child.val();
    const key = child.key;

    const div = document.createElement('div');
    div.className = 'note';

    // Only add delete button if it exists in the DOM
    const deleteBtnHTML = saveBtn && noteInput ? `<button class="delete-btn" data-key="${key}">Delete</button>` : '';

    div.innerHTML = `
      <div class="txt">${note.text}</div>
      ${deleteBtnHTML}
    `;

    notesContainer.appendChild(div);
  });

  // Attach delete listeners only if delete buttons are present
  if (saveBtn && noteInput) {
    document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', () => {
        const key = button.getAttribute('data-key');
        remove(ref(db, 'notes/' + key));
      });
    });
  }
});