// detectDataImage.js
(function() {
    // Check if the current URL starts with 'data:image'
    if (window.location.href.startsWith('data:image')) {
        // Create a <style> element
        const style = document.createElement('style');
        style.textContent = `
            body, embed, iframe {
                position: absolute !important;
                display: block;
                width: 100%;
                height: 100%;
                margin: 0;
                padding: 0;
                border: none;
                overflow: hidden;
            }
        `;
        // Append the style to the document head
        document.head.appendChild(style);
    }
})();
