import { browser } from "wxt/browser";

export default defineContentScript({
    matches: ["*://*.google.com/*"],
    main(ctx) {
        console.log("[WXT] Content Script läuft auf:", window.location.href);

        browser.runtime.onMessage.addListener(async (message) => {
            if (message.type === "SHOW_OVERLAY") {
                const stored = await browser.storage.local.get("overlayImage");
                const imgData = stored.overlayImage;
                if (!imgData) return;

                const { data, type } = imgData;

                // Base64 → Blob → Object URL
                const binary = atob(data);
                const bytes = new Uint8Array(binary.length);
                for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
                const blob = new Blob([bytes], { type });
                const url = URL.createObjectURL(blob);

                // Falls schon ein Overlay existiert, löschen
                const existing = document.getElementById("wxt-overlay-image");
                if (existing) existing.remove();

                // Neues <img> Element erstellen
                const img = document.createElement("img");
                img.id = "wxt-overlay-image";
                img.src = url;
                img.style.position = "fixed";
                img.style.top = "0";
                img.style.left = "0";
                img.style.width = "100vw";
                img.style.height = "100vh";
                img.style.zIndex = "999999";
                img.style.pointerEvents = "none";
                img.style.opacity = "0.8";

                document.body.appendChild(img);
            }
        });
    },
});
