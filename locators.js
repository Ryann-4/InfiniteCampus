async function showLocationAndIp() {
    let infoEl = document.getElementById("ligma");
    try {
        const res  = await fetch("https://ipapi.co/json/");
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        if (!infoEl) {
            infoEl = document.createElement("div");
            infoEl.id = "ligma";
            document.body.appendChild(infoEl);
        }
        infoEl.innerText =
            `Current State:\n ${data.region ?? "Your State"}\n` +
            `You are currently located near:\n ${data.city ?? "Your Area"}\n` +
            `Your IPv4 address is currently:\n ${data.ip ?? "Unknown"}\n` +
            `Current Org:\n ${data.org ?? "None"}\n` +
            `Current Zip Code:\n ${data.postal ?? "Zip Code"}\n` +
            `Current Latitude:\n ${data.latitude ?? "0"}\n` +
            `Current Longitude:\n ${data.longitude ?? "0"}`;
        infoEl.classList.add("show");
    } catch (err) {
        console.error("Error fetching location:", err);
        if (!infoEl) {
            infoEl = document.createElement("div");
            infoEl.id = "ligma";
            document.body.appendChild(infoEl);
        }
        infoEl.innerText = "Error #3";
        infoEl.classList.add("show");
    }
}
function init() {
    showLocationAndIp();
}
document.addEventListener("DOMContentLoaded", init);