async function showLocationAndIp() {
    const infoEl = document.getElementById("ligma");
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
        infoEl.innerText =
        `Error #3`;
        infoEl.classList.add("show");
    }
}
async function init() {
    await showLocationAndIp();
}
init();