const AUTO_DELETE_MS = 5 * 60 * 1000;
const NGROK_HEADERS = { "ngrok-skip-browser-warning": "true" };
async function fetchFiles() {
    const res = await fetch("https://sol-nonconnotative-arrogatingly.ngrok-free.dev/admin/files", { headers: NGROK_HEADERS });
    const files = await res.json();
    const tbody = document.querySelector("#fileTable tbody");
    tbody.innerHTML = "";
    files.forEach(f => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${f.number}</td>
            <td>${f.name}</td>
            <td>${formatBytes(f.size)}</td>
            <td>${f.remainingSec}s</td>
            <td>
                <button onclick="downloadFile('${f.name}')">Download</button>
                <button onclick="deleteFile('${f.name}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}
async function deleteFile(filename) {
    if (!confirm(`Delete ${filename}?`)) return;
    const res = await fetch(`https://sol-nonconnotative-arrogatingly.ngrok-free.dev/admin/files/${encodeURIComponent(filename)}`, {
        method: "DELETE",
        headers: NGROK_HEADERS
    });
    if (res.ok) fetchFiles();
    else alert("Failed To Delete File");
}
function downloadFile(filename) {
    const link = document.createElement("a");
    link.href = `https://sol-nonconnotative-arrogatingly.ngrok-free.dev/files/${encodeURIComponent(filename)}`;
    link.download = filename;
    link.click();
}
function formatBytes(bytes) {
    const units = ["B", "KB", "MB", "GB"];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) { bytes /= 1024; i++; }
    return bytes.toFixed(1) + " " + units[i];
}
setInterval(fetchFiles, 1000);
fetchFiles();