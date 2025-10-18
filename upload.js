const MAX_SIZE = 500 * 1024 * 1024;
const CHUNK_SIZE = 512 * 1024;

const appDiv = document.getElementById("app");

const params = new URLSearchParams(window.location.search);
const fileId = params.get("id");

if (fileId) {
    // You could implement fetching via your own API if you want downloads
    appDiv.innerHTML = `<center><h2 class="tptxt">File downloads must be handled via the API.</h2></center>`;
} else {
    appDiv.innerHTML = `
        <center>
            <h2 class="tptxt">Upload A File → Get A 5+ Minute Download Link</h2>
            <input type="file" id="fileInput">
            <label for="fileInput" class="custom-file-upload">Choose File</label>
            <p id="fileName"></p>
            <div id="progressContainer"><div id="progressBar"></div></div>
            <p id="output"></p>
        </center>
    `;

    const input = document.getElementById("fileInput");
    const fileNameDisplay = document.getElementById("fileName");
    const progressBar = document.getElementById("progressBar");
    const progressContainer = document.getElementById("progressContainer");
    const output = document.getElementById("output");

    input.addEventListener("change", async () => {
        const file = input.files[0];
        if (!file) return;

        fileNameDisplay.textContent = "Selected File: " + file.name;

        if (file.size > MAX_SIZE) {
            alert("File Too Large! Maximum Allowed Size Is 500 MB.");
            input.value = "";
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        progressContainer.style.display = "block";
        progressBar.style.width = "0%";

        try {
            const response = await fetch("https://sol-nonconnotative-arrogatingly.ngrok-free.dev/uploadthis", {
                method: "POST",
                headers: {
                    "ngrok-skip-browser-warning": "true" // example ngrok header
                },
                body: formData
            });

            if (!response.ok) throw new Error(`Upload failed: ${response.statusText}`);

            const result = await response.json(); // assuming API returns JSON with fileId
            const link = `${window.location.origin}${window.location.pathname}?id=${result.fileId}`;

            progressBar.style.width = "100%";

            output.innerHTML = `
                <center>
                    <p>Temporary Link (5+ Mins):</p>
                    <input type="text" id="fileLink" value="${link}" readonly style="width:80%">
                    <button class="button" onclick="copyLink()">Copy</button>
                </center>
            `;
        } catch (err) {
            console.error(err);
            output.innerHTML = `<p style="color:red;">Upload failed: ${err.message}</p>`;
        }
    });

    window.copyLink = () => {
        const link = document.getElementById("fileLink");
        link.select();
        document.execCommand("copy");
        alert("Copied To Clipboard!");
    };
}
