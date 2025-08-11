function asciiEncode(str) {
    return [...str].map(c => {
        const code = c.charCodeAt(0);
        if (
            (code >= 65 && code <= 90) ||
            (code >= 97 && code <= 122) ||
            (code >= 48 && code <= 57) ||
            c === '-' || c === '_' || c === '.' || c === '~'
        ) {
            return c;
        }
        if (code === 10) return '%0A';
        if (code === 13) return '';
        if (code === 9) return '%09';
        if (code === 32) return '%20';
        return '%' + code.toString(16).toUpperCase().padStart(2, '0');
    }).join('');
}
function base64Decode(str) {
    return decodeURIComponent(escape(window.atob(str)));
}
function generateBase64(url) {
    if (!url) {
        alert("Please Enter A URL.");
        return '';
    }
    if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
    }
    let template = base64Decode(r);
    template = template.replace('${url}', url);
    const base64 = btoa(unescape(encodeURIComponent(template)));
    return `data:image/svg+xml;base64,${base64}`;
}
function generateAsciiEncodedHtml(url) {
    if (!url) {
        alert("Please Enter A URL.");
        return '';
    }
    if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
    }
    let htmlCode = base64Decode(t);
    htmlCode = htmlCode.replace("PUT_URL_HERE", url);
    const encoded = asciiEncode(htmlCode);
    return 'data:text/html;charset=utf-8,' + encoded;
}
function generateDataUrl() {
    let urlInput = document.getElementById('urlInput').value.trim();
    const preset = document.getElementById('presetSelect').value;
    const type = document.getElementById('typeSelect').value;
    if (!urlInput && preset) urlInput = preset;
    if (!urlInput) {
        alert("Please Select Or Enter A URL.");
        return;
    }
    let result = '';
    if (type === 'image') {
        result = generateBase64(urlInput);
    } else {
        result = generateAsciiEncodedHtml(urlInput);
    }
    document.getElementById('output').value = result;
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
    .then(() => alert("Copied to clipboard!"))
    .catch(() => alert("ERR#14 Failed to copy."));
});