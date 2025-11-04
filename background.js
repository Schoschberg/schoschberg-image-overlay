

// background.js (Service Worker)
chrome.runtime.onMessage.addListener = async (message, sender) => {
    console.log("Nachricht empfangen:", message);

    if (message.action === "saveData") {
        await chrome.storage.local.set({ foo: message.data });
        return { ok: true }; // Antwort als Promise
    }
};


chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "saveData") {
        chrome.storage.local.set(msg.data);
    }
});
