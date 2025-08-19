window.addEventListener("DOMContentLoaded", () => {
    if (!document.getElementById("playerPopup")) {
        const popup = document.createElement("div");
        popup.id = "playerPopup";
        popup.style.display = "none";
        document.body.appendChild(popup);
    }
});
