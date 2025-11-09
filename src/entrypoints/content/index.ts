import { browser } from "wxt/browser";

export default defineContentScript({
    matches: ["<all_urls>"],
    main(ctx) {
        browser.runtime.onMessage.addListener(async (message) => {
            if (message.type === "SHOW_OVERLAY") {
                const stored = await browser.storage.local.get("overlayImage");
                const imgData = stored.overlayImage;
                if (!imgData) return;

                const existing = document.getElementById("wxt-overlay-image");
                if (existing) existing.remove();

                const img = document.createElement("img");
                img.id = "wxt-overlay-image";
                img.src = imgData.data; // <-- direkt verwenden, kein atob nötig
                Object.assign(img.style, {
                    position: "absolute",
                    top: `${message.shift}rem`,
                    left: "0",
                    width: "100%",
                    height: "auto",
                    zIndex: "999999",
                    pointerEvents: "none",
                    opacity: "0.3",
                });

                document.body.appendChild(img);
            }
            if (message.type === "HIDE_OVERLAY") {
                const existing = document.getElementById("wxt-overlay-image");
                if (existing) existing.remove();
            }
        });

    },
});
