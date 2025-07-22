(function () {
    // Check if the current URL starts with 'data:image'
    if (window.location.href.startsWith('data:image')) {
        const dataUrl = window.location.href;

        // Open about:blank
        const newDoc = document.open("text/html", "replace");

        // Write HTML with the data:image embedded in an <img> tag
        newDoc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Image Viewer</title>
                <style>
                    body, html {
                        margin: 0;
                        padding: 0;
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #000;
                    }
                    img {
                        max-width: 100%;
                        max-height: 100%;
                        display: block;
                    }
                </style>
            </head>
            <body>
                <img src="${dataUrl}" alt="Image"/>
            </body>
            </html>
        `);
        newDoc.close();
    }
})();
