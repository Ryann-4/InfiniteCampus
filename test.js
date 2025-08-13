(function(){
    const startUrl = document.getElementById('startUrl');
    const maxPages = document.getElementById('maxPages');
    const startBtn = document.getElementById('startBtn');
    const statusEl = document.getElementById('status');
    const htmlSection = document.getElementById('htmlSection');
    const jsSection = document.getElementById('jsSection');
    const otherSection = document.getElementById('otherSection');
    startUrl.value = location.origin + '/';
    const ESC = { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' };
    function escapeHTML(s) { return String(s).replace(/[&<>"']/g, ch => ESC[ch]); }
    function addResult(parent, url, cls, content) {
        const details = document.createElement('details');
        const summary = document.createElement('summary');
        summary.innerHTML = `<span class="pill ${cls}">${cls.toUpperCase()}</span> ${escapeHTML(url)}`;
        const pre = document.createElement('pre');
        pre.textContent = content;
        details.appendChild(summary);
        details.appendChild(pre);
        parent.appendChild(details);
    }
    async function parseListXML(start) {
        const base = new URL(start);
        const listURL = new URL('/list.xml', base).toString();
        try {
            const res = await fetch(listURL, { credentials: 'include' });
            if (!res.ok) throw new Error('list.xml not found');
            const txt = await res.text();
            const dom = new DOMParser().parseFromString(txt, 'application/xml');
            const locs = Array.from(dom.getElementsByTagNameNS("*", "loc")).map(n => n.textContent.trim());
            return locs.filter(u => u.startsWith(base.origin));
        } catch(e) {
            console.error(e);
            return [];
        }
    }
    function categorizeAndSort(urls) {
        const htmlFiles = [];
        const jsFiles = [];
        const otherFiles = [];
        urls.forEach(url => {
            const ext = (url.split('.').pop() || '').toLowerCase();
            if (ext === 'html' || ext === 'htm') htmlFiles.push(url);
            else if (ext === 'js') jsFiles.push(url);
            else otherFiles.push(url);
        });
        htmlFiles.sort(); jsFiles.sort(); otherFiles.sort();
        return { htmlFiles, jsFiles, otherFiles };
    }
    async function crawl() {
        htmlSection.innerHTML = "<h2>HTML Files</h2>";
        jsSection.innerHTML = "<h2>JavaScript Files</h2>";
        otherSection.innerHTML = "<h2>Other Files</h2>";
        const start = startUrl.value.trim() || location.origin + '/';
        const limitPages = Math.max(1, parseInt(maxPages.value) || 1);
        statusEl.textContent = "Loading...";
        let urls = await parseListXML(start);
        if (!urls.length) urls = [start];
        const { htmlFiles, jsFiles, otherFiles } = categorizeAndSort(urls);
        const allFiles = [...htmlFiles, ...jsFiles, ...otherFiles].slice(0, limitPages);
        let count = 0;
        for (const file of allFiles) {
            statusEl.textContent = `Fetching ${file} (${++count}/${allFiles.length})`;
            try {
                const res = await fetch(file, { credentials: 'include' });
                const text = await res.text();
                const cls = res.ok ? 'ok' : 'warn';
                if (htmlFiles.includes(file)) addResult(htmlSection, file, cls, text);
                else if (jsFiles.includes(file)) addResult(jsSection, file, cls, text);
                else addResult(otherSection, file, cls, text);
            } catch(e) {
                if (htmlFiles.includes(file)) addResult(htmlSection, file, 'bad', e.message);
                else if (jsFiles.includes(file)) addResult(jsSection, file, 'bad', e.message);
                else addResult(otherSection, file, 'bad', e.message);
            }
            await new Promise(r => setTimeout(r, 250)); 
        }
        statusEl.textContent = "Done.";
    }
    startBtn.addEventListener('click', crawl);
})();