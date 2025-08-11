import { r } from 'main.js';
function decodeBase64(base64Str) {
    return decodeURIComponent(escape(window.atob(base64Str)));
}
function generateBase64() {
    let url = document.getElementById('urlInput').value.trim();
    if (!url) {
        alert("Please enter a URL.");
        return;
    }
    if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
    }
    let template = decodeBase64(r);
    template = template.replace('${url}', url);
    const base64 = btoa(unescape(encodeURIComponent(template)));
    const dataUri = `data:image/svg+xml;base64,${base64}`;
    document.getElementById('output').value = dataUri;
}
document.getElementById('urlInput').addEventListener('keypress', function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        generateBase64();
    }
});
document.getElementById('copyBtn').addEventListener('click', function() {
    const output = document.getElementById('output').value;
    if (!output) {
        alert("Nothing to copy. Generate a Base64 string first.");
        return;
    }
    navigator.clipboard.writeText(output)
    .then(() => alert("Copied to clipboard!"))
    .catch(() => alert("Failed to copy."));
});