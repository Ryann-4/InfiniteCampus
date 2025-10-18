const MAX_SIZE = 500 * 1024 * 1024;

const appDiv = document.getElementById("app");

appDiv.innerHTML = `
  <center>
    <h2 class="tptxt">Upload A File → Get A 5+ Minute Download Link</h2>
    <input type="file" id="fileInput">
    <label for="fileInput" class="custom-file-upload">Choose File</label>
    <p id="fileName"></p>
    <div id="progressContainer" style="display:none; width:80%; background:#333; border-radius:4px; margin:10px auto;">
      <div id="progressBar" style="width:0%; height:20px; background:#4caf50; border-radius:4px;"></div>
    </div>
    <p id="output"></p>
  </center>
`;

const input = document.getElementById("fileInput");
const fileNameDisplay = document.getElementById("fileName");
const progressBar = document.getElementById("progressBar");
const progressContainer = document.getElementById("progressContainer");
const output = document.getElementById("output");

input.addEventListener("change", () => {
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

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/uploadthis", true);

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      const percent = Math.round((e.loaded / e.total) * 100);
      progressBar.style.width = percent + "%";
    }
  };

  xhr.onload = () => {
    if (xhr.status === 200) {
      try {
        const res = JSON.parse(xhr.responseText);
        const link = res.fileUrl;
        output.innerHTML = `
          <center>
            <p>Temporary Download Link (5+ Mins):</p>
            <input type="text" id="fileLink" value="${link}" readonly style="width:80%">
            <button class="button" onclick="copyLink()">Copy</button>
            <br><br>
            <a href="${link}" target="_blank">
              <button class="button">Go To Download Page</button>
            </a>
          </center>
        `;
        progressBar.style.width = "100%";
      } catch (err) {
        output.innerHTML = `<p style="color:red;">Error parsing server response</p>`;
        console.error(err);
      }
    } else {
      output.innerHTML = `<p style="color:red;">Upload Failed: ${xhr.statusText}</p>`;
    }
  };

  xhr.onerror = () => {
    output.innerHTML = `<p style="color:red;">Upload Failed (Network Error)</p>`;
  };

  xhr.send(formData);
});

window.copyLink = () => {
  const link = document.getElementById("fileLink");
  link.select();
  document.execCommand("copy");
  alert("Copied To Clipboard!");
};
