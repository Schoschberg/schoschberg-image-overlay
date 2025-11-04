let imageData = null;

// Datei einlesen
// popup.js
document.getElementById("fileButton").addEventListener("click", () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            func: () => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (event) => {
                    const file = event.target.files[0];
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        console.log("Bild geladen");
                        chrome.runtime.sendMessage({ action: "saveData", data: { key: "value" } });
                        console.log("message sent");

                        // e.target.result
                    };
                    reader.readAsDataURL(file);
                };
                input.click();
            }
        });
    });
});

// popup.js
document.getElementById("fileInput").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    console.log(file);
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        const imageData = e.target.result;
        // In Chrome Storage speichern
        console.log("speichere im localstorage:");
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.tabs.sendMessage(tab.id, { type: "setImage", url: imageData });
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
