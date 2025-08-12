function showMessage(text, isError = true) {
    const existing = document.getElementById('corsWarning');
    if (existing) existing.remove();
    const container = document.createElement('div');
    container.id = 'corsWarning';
    container.style.marginTop = '15px';
    container.style.textAlign = 'center';
    const msg = document.createElement('p');
    msg.textContent = text;
    msg.style.color = isError ? 'red' : 'green';
    container.appendChild(msg);
    const btn = document.getElementById('openCustomUrl');
    btn.insertAdjacentElement('afterend', container);
}
function openGame(url) {
    var win = window.open();
    if (win) {
        var iframe = win.document.createElement('iframe');
        iframe.style.width = "100vw";
        iframe.style.height = "100vh";
        iframe.style.border = "none";
        iframe.src = url;
        win.document.title = "Infinite Campus";
        win.document.body.style.margin = "0"; 
        win.document.body.style.overflow = "hidden"; 
        win.document.body.appendChild(iframe);
    } else {
        showMessage("Err#1 Popup Blocked");
    }
}
function normalizeUrl(url) {
    url = url.trim();
    if (/^https?:\/\/www\./i.test(url)) {
        return url;
    }
    url = url.replace(/^https?:\/\//i, '');
    return 'https://www.' + url;
}
async function checkURLStatus(url) {
    url = normalizeUrl(url);
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
document.getElementById('openCustomUrl').addEventListener('click', async () => {
    let url = document.getElementById('customUrl').value.trim();
    if (!url) {
        showMessage('Please Enter A URL.');
        return;
    }
    try {
        url = new URL(url).href;
    } catch {
        try {
            url = normalizeUrl(url);
            url = new URL(url).href;
        } catch {
            showMessage('Invalid URL. Please Enter A Valid URL.');
            return;
        }
    }
    const existingWarning = document.getElementById('corsWarning');
    if (existingWarning) existingWarning.remove();
    const check = await checkURLStatus(url);
    if (check.status === "cors-ok" || check.status === "cors-ok-but-error") {
        openGame(url);
    } else if (check.status === "cors-blocked") {
        const container = document.createElement('div');
        container.id = 'corsWarning';
        container.style.marginTop = '15px';
        container.style.textAlign = 'center';
        const warningText = document.createElement('p');
        warningText.style.color = 'red';
        warningText.textContent = 'Website Does Not Have CORS Enabled About:Blank May Not Work';
        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.classList.add('button');
        okButton.style.marginTop = '8px';
        okButton.style.padding = '8px 16px';
        okButton.style.cursor = 'pointer';
        okButton.addEventListener('click', () => {
            openGame(url);
            container.remove();
        });
        container.appendChild(warningText);
        container.appendChild(okButton);
        const openBtn = document.getElementById('openCustomUrl');
        openBtn.insertAdjacentElement('afterend', container);
    } else {
        showMessage('ERR#15 Website Does Not Exist');
    }
});
document.getElementById('openInfiniteCampus').addEventListener('click', () => {
    openGame('https://infinitecampus.xyz');
});