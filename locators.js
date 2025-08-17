async function showLocationAndIp() {
    const infoEl = document.getElementById("ligma") || (() => {
        const el = document.createElement("div");
        el.id = "ligma";
        document.body.appendChild(el);
        return el;
    })();

    const useBetterWeather = localStorage.getItem("betterWeather") === "true";
    let city = sessionStorage.getItem("city");
    let state = sessionStorage.getItem("state");
    let exactAddress = "";
    let ipData = {};

    try {
        // Always fetch IP data for org and fallback info
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) throw new Error("IP fetch failed");
        ipData = await res.json();

        if (useBetterWeather && navigator.geolocation) {
            // Geolocation enabled → exact address
            await new Promise((resolve) => {
                navigator.geolocation.getCurrentPosition(async (pos) => {
                    const lat = pos.coords.latitude;
                    const lon = pos.coords.longitude;
                    try {
                        const revRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                        const revData = await revRes.json();

                        exactAddress = revData.display_name || "";
                        city = revData.address.city || revData.address.town || revData.address.village || ipData.city || "";
                        state = revData.address.state || ipData.region || "";

                        // Save to sessionStorage
                        sessionStorage.setItem('city', city);
                        sessionStorage.setItem('state', state);

                        resolve();
                    } catch (err) {
                        console.warn("Reverse geocode failed, using IP fallback", err);
                        city = ipData.city || "";
                        state = ipData.region || "";
                        resolve();
                    }
                }, (err) => {
                    console.warn("Geolocation failed, using IP fallback", err);
                    city = ipData.city || "";
                    state = ipData.region || "";
                    resolve();
                });
            });
        } else if (!useBetterWeather && city && state) {
            // Switch off but sessionStorage exists → use city/state from storage
            // ipData is already fetched for org
        } else {
            // Switch off, no sessionStorage → use IP data
            city = ipData.city || "";
            state = ipData.region || "";
        }

        infoEl.innerText =
            `Current State:\n ${state || "Your State"}\n` +
            `You Are Currently Located Near:\n ${exactAddress || city || "Your Area"}\n` +
            `Your IPv4 Address Is Currently:\n ${ipData.ip || "Unknown"}\n` +
            `Current Org:\n ${ipData.org || "None"}\n` +
            `Current Zip Code:\n ${ipData.postal || "Zip Code"}\n` +
            `Current Latitude:\n ${ipData.latitude || "0"}\n` +
            `Current Longitude:\n ${ipData.longitude || "0"}`;

        infoEl.classList.add("show");
    } catch (err) {
        console.error("Error fetching location:", err);
        infoEl.innerText = "Error #3";
        infoEl.classList.add("show");
    }
}

function init() {
    showLocationAndIp();
}

document.addEventListener("DOMContentLoaded", init);
