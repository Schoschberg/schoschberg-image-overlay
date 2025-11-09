<script lang="ts">
  import svelteLogo from '../../assets/svelte.svg'
  import './app.css'

  let overlayImageObject = $state(null);

  // ✅ Initialen Wert laden
  browser.storage.local.get("overlayImage").then((data) => {
    overlayImageObject = data.overlayImage ?? null;
  });

  // ✅ Reaktiv auf Änderungen im Storage hören
  browser.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.overlayImage) {
      overlayImageObject = changes.overlayImage.newValue ?? null;
    }
  });

  let horizontalShift = $state(0);

  async function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    // Beispiel: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA..."
    await browser.storage.local.set({
      overlayImage: { name: file.name, data: base64 },
    });

    console.log("Bild gespeichert!");
  }

  async function showImageOnWebsite() {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    try {
      await browser.tabs.sendMessage(tab.id!, { type: "SHOW_OVERLAY", shift: horizontalShift });
    } catch (err) {
      console.error("Kein Content Script:", err);
    }
  }

  async function removeImageFromWebsite() {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    try {
      await browser.tabs.sendMessage(tab.id!, { type: "HIDE_OVERLAY" });
    } catch (err) {
      console.error("Kein Content Script:", err);
    }
  }
</script>

<main>
  <h1 style="padding-bottom: 1rem">Finns <br/> Image Overlay</h1>
  <div class="center">
    {#if overlayImageObject != null}
      <p>Aktuelles Image: {overlayImageObject.name}</p>
      <img src={overlayImageObject.data} />
    {/if}
  </div>
  <div  class="center">
    <input type="file" accept="image/*" on:change={handleFileChange} />
    <div class="horizontal">
    <label for="horizontalShiftInput">Vertikale Verschiebung in rem</label>
    <input id="horizontalShiftInput" type="number" bind:value={horizontalShift} >
    </div>

  <div class="horizontal">
    <button on:click={showImageOnWebsite}>Show Image</button>
    <button on:click={removeImageFromWebsite}>Remove image</button>
  </div>
  </div>

</main>

<style>
  .fileInput {
    border: white 1px;
  }
  img {
    max-width: 10rem;
    max-height: 10rem;
    object-fit: cover;
    width: 100%;
  }
  .center {
    padding-top: 1rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 1rem;
  }
  .horizontal {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    gap: 1rem;
  }
  input {
    border-radius: 8px;
    border: 1px solid transparent;
    padding: 0.6em 1.2em;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
    background-color: #1a1a1a;
    cursor: pointer;
    transition: border-color 0.25s;
  }
</style>
