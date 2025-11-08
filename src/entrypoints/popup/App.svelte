<script lang="ts">
  import svelteLogo from '../../assets/svelte.svg'
  import Counter from '../../lib/Counter.svelte'

  let image = $state()


  async function sendToBackground(event: InputEvent) {
    const file = event.target.files[0];
    if (!file) return;

    // Datei als ArrayBuffer lesen
    const arrayBuffer = await file.arrayBuffer();

    // In Base64 umwandeln (da Storage kein reines Binary speichert)
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    // Nachricht an Background senden
    await browser.runtime.sendMessage({
      type: "SAVE_FILE",
      name: file.name,
      data: base64,
    });

    console.log("Datei an Background gesendet!");
  }

  async function showImageOnWebsite() {
    // Sagt dem Content Script, es soll das Overlay anzeigen
    await browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id!, { type: "SHOW_OVERLAY" });
    });
  }

</script>

<main>
  <div>
    <a href="https://wxt.dev" target="_blank" rel="noreferrer">
      <img src="/wxt.svg" class="logo" alt="WXT Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  <h1>WXT + Svelte</h1>

  <div class="card">

    <input type="file" accept="image/*" onchange={sendToBackground} />
    <button onclick={showImageOnWebsite}>Bild auf Website anzeigen</button>
  </div>

  <p class="read-the-docs">
    Click on the WXT and Svelte logos to learn more
  </p>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #54bc4ae0);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
