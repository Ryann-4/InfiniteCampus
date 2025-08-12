async function checkURLStatus(url) {
    const statusEl = document.getElementById('status');
    statusEl.textContent = "Verifying...";
    if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
    }
    try {
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
            return { status: "cors-ok" };
        } else {
            return { status: "cors-ok-but-error", code: response.status };
        }
    } catch (error) {
        if (error.name === "TypeError") {
            try {
                await fetch(url, { method: 'HEAD', mode: 'no-cors' });
                return { status: "cors-blocked" };
            } catch {
                return { status: "not-exist" };
            }
        }
        return { status: "not-exist" };
    }
}
async function generateDataUrl() {
    let urlInput = document.getElementById('urlInput').value.trim();
    const preset = document.getElementById('presetSelect').value;
    const type = document.getElementById('typeSelect').value;
    const statusEl = document.getElementById('status');
    if (!urlInput && preset) urlInput = preset;
    if (!urlInput) {
        alert("Please Select Or Enter A URL.");
        return;
    }
    const check = await checkURLStatus(urlInput);
    if (check.status === "cors-ok" || check.status === "cors-ok-but-error") {
        statusEl.textContent = "Generating URL";
        let result = '';
        if (type === 'image') {
            result = generateBase64(urlInput);
        } else {
            result = generateAsciiEncodedHtml(urlInput);
        }
        document.getElementById('output').value = result;
        statusEl.textContent = "Success!";
    }
    else if (check.status === "not-exist") {
        statusEl.textContent = "Website Not Found";
        document.getElementById('output').value = '';
    }
    else if (check.status === "cors-blocked") {
        statusEl.textContent = "Website Does Not Allow CORS So Link Will Not Work";
        document.getElementById('output').value = '';
    }
}
document.getElementById('presetSelect').addEventListener('change', () => {
    const presetVal = document.getElementById('presetSelect').value;
    if (presetVal) {
        document.getElementById('urlInput').value = presetVal;
    }
});
document.getElementById('generateBtn').addEventListener('click', generateDataUrl);
document.getElementById('urlInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        e.preventDefault();
        generateDataUrl();
    }
});
document.getElementById('copyBtn').addEventListener('click', () => {
    const output = document.getElementById('output').value;
    if (!output) {
        alert("Nothing To Copy. Generate A URL First.");
        return;
    }
    navigator.clipboard.writeText(output)
        .then(() => alert("Copied To Clipboard"))
        .catch(() => alert("ERR#14 Failed To Copy"));
});