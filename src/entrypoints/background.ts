import { browser } from 'wxt/browser';

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });
});

export let localStorage = browser.storage.local;



browser.runtime.onMessage.addListener(async (message) => {
  if (message.type === "SAVE_FILE") {
    const { name, data } = message;

    // Datei im local storage speichern
    await browser.storage.local.set({
      image: message, // Key = Dateiname, Value = Base64-Daten
    });

    console.log(`Datei "${name}" im Storage gespeichert.`);
  }
});


