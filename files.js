document.getElementById('imageInput').addEventListener('change', function () {
    const fileLabel = document.getElementById('fileLabel');
    if (this.files.length > 0) {
        fileLabel.textContent = `Selected: ${this.files[0].name}`;
    } else {
        fileLabel.textContent = '';
    }
});