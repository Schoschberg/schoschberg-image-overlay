let imageData = null;

// Datei einlesen
document.getElementById("fileInput").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        imageData = e.target.result; // Base64-String
    };
    reader.readAsDataURL(file);
});

// Overlay einfügen
document.getElementById("apply").addEventListener("click", async () => {
    if (!imageData) {
        alert("Bitte zuerst ein Bild auswählen!");
        return;
    }
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { type: "setImage", url: imageData });
});

// Overlay entfernen
document.getElementById("remove").addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { type: "setImage", url: null });
});
