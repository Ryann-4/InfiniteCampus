import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";
import { getDatabase, ref, get, set, remove } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-database.js";
const firebaseConfig = {
    apiKey:"AIzaSyDROtdBgyU_IM2xQ0ymkG8mFzjR5MjGTRQ",
    authDomain:"media-saver-aa51c.firebaseapp.com",
    projectId:"media-saver-aa51c",
    storageBucket:"media-saver-aa51c.appspot.com",
    messagingSenderId:"6224876935",
    appId:"1:6224876935:web:ffaf530c99365e910caf22",
    databaseURL:"https://media-saver-aa51c-default-rtdb.firebaseio.com/"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const tbody = document.querySelector("#fileTable tbody");
async function loadFiles(){
    tbody.innerHTML="<tr><td colspan='5'>Loading...</td></tr>";
    const snapshot = await get(ref(db,"files"));
    tbody.innerHTML="";
    if(!snapshot.exists()){tbody.innerHTML="<tr><td colspan='5'>No Files Found.</td></tr>"; return;}
    const files = snapshot.val();
    Object.keys(files).forEach(id=>{
        const file = files[id];
        const name = file.meta?.name||"N/A";
        const createdAt = file.meta?.createdAt?new Date(file.meta.createdAt).toLocaleString():"N/A";
        const clicks = file.clicks||0;
        const chunks = file.chunks || {};
        let totalBase64Length = 0;
        Object.values(chunks).forEach(c => totalBase64Length += c.length);
        const sizeBytes = Math.floor(totalBase64Length * 3 / 4);
        const sizeMB = (sizeBytes / (1024*1024)).toFixed(2) + " MB";
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${id}</td>
            <td>${name}</td>
            <td>${createdAt}</td>
            <td>${clicks}</td>
            <td>${sizeMB}</td>
            <td>
                <button class="button" onclick="downloadFile('${id}')">Download</button>
                <button class="button" onclick="deleteFile('${id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}
window.deleteFile = async function(id){
    if(confirm("Are You Sure?")){
        await remove(ref(db,"files/"+id));
        loadFiles();
    }
}
window.downloadFile = async function(id){
    const snapshot = await get(ref(db,"files/"+id));
    if(!snapshot.exists()){alert("File Not Found Or Expired."); return;}
    const fileData = snapshot.val();
    const chunks = fileData.chunks||{};
    const sortedKeys = Object.keys(chunks).sort((a,b)=>parseInt(a)-parseInt(b));
    const progressContainer = document.createElement("div");
    const progressBar = document.createElement("progress");
    progressBar.max = sortedKeys.length; progressBar.value = 0;
    progressContainer.appendChild(progressBar);
    document.body.appendChild(progressContainer);
    let base64Data="";
    for(let i=0;i<sortedKeys.length;i++){
        base64Data+=chunks[sortedKeys[i]];
        progressBar.value=i+1;
        await new Promise(r=>setTimeout(r,10));
    }
    progressContainer.remove();
    const a = document.createElement("a");
    a.href = base64Data;
    a.download=fileData.meta.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
}
loadFiles();