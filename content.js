function addOverlayImage(url) {
    const existing = document.getElementById("overlay-extension-image");
    if (existing) existing.remove();

    if (!url) return; // nichts einfügen, nur löschen

    const img = document.createElement("img");
    img.id = "overlay-extension-image";
    img.src = url;
    Object.assign(img.style, {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        opacity: 0.3,
        pointerEvents: "none",
        zIndex: 9999999
    });

    document.body.appendChild(img);
}

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "setImage") {
        addOverlayImage(msg.url);
    }
});
