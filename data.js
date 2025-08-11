const r = `PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3R5bGU9IndpZHRoOjEwMHZ3ICFpbXBvcnRhbnQ7IGhlaWdodDoxMDB2aCAhaW1wb3J0YW50OyI+PHRpdGxlPkdvb2dsZTwvdGl0bGU+PGZvcmVpZ25PYmplY3QgeD0iMCIgeT0iMCIgc3R5bGU9IndpZHRoOjEwMHZ3ICFpbXBvcnRhbnQ7IGhlaWdodDoxMDB2aCAhaW1wb3J0YW50OyI+PGVtYmVkIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hodG1sIiBzcmM9IiR7dXJsfSIgdHlwZT0idGV4dC9wbGFpbiIgc3R5bGU9ImhlaWdodDoxMDB2aCAhaW1wb3J0YW50OyB3aWR0aDoxMDB2dyAhaW1wb3J0YW50OyIgLz48L2ZvcmVpZ25PYmplY3Q+PC9zdmc+Cg==`;
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