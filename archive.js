document.querySelectorAll('.vhtml').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const fileURL = this.getAttribute('href');
        fetch(fileURL)
            .then(response => response.text())
            .then(html => {
                const win = window.open();
                win.document.write('<pre>' +
                    html.replace(/</g, '&lt;').replace(/>/g, '&gt;') +
                    '</pre>');
            })
            .catch(err => alert('Error: ' + err));
    });
});