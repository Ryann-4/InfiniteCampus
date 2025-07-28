document.addEventListener("DOMContentLoaded", () => {
    const siteHeader = document.getElementById("site-header");
    const testElements = document.querySelectorAll(".test");

    if (siteHeader && testElements.length > 0) {
        // Get the computed background of the #site-header
        const headerBackground = window.getComputedStyle(siteHeader).background;

        // Apply this background to all elements with the .test class
        testElements.forEach(element => {
            element.style.background = headerBackground;
        });
    } else {
        console.warn("#site-header or .test elements not found.");
    }
});
