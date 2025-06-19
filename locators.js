async function showLocationAndIp() {
    try {
        const res  = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        const currentCity = data.city ?? "Your Area";
        const ip          = data.ip   ?? "Unknown";
        const org         = data.org  ?? "None";
        const currentState = data.region ?? "Your State";
        const zipCode = data.postal ?? "Zip Code";
        const latitude = data.latitude ?? "0";
        const longitude = data.longitude ?? "0";
        const infoEl = document.getElementById("ligma");
        if (infoEl) {
            infoEl.innerText =
            `Current State:\n ${currentState}\n` +
            `You are currently located near:\n ${currentCity}\n` +
            `Your IPv4 address is currently:\n ${ip}\n` +
            `Current Org:\n ${org}\n` +
            `Current Zip Code:\n ${zipCode}\n` +
            `Current Latitude:\n ${latitude}\n` +
            `Current Longitude:\n ${longitude}`;
            infoEl.classList.add("show");
        }
    } catch (err) {
        document.body.innerHTML = "<div>Error#3</div>";
    }
}
async function init() {
    await showLocationAndIp();
}
init();