<script lang="ts">
  import './app.css'

  let overlayImageObject = $state(null);

  browser.storage.local.get("overlayImage").then((data) => {
    overlayImageObject = data.overlayImage ?? null;
  });

  browser.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.overlayImage) {
      overlayImageObject = changes.overlayImage.newValue ?? null;
    }
  });

  let horizontalShift = $state(0);
  let shiftLoaded = $state(false);
  let overlayVisible = $state(false);

  browser.storage.local.get("verticalShift").then((data) => {
    if (typeof data.verticalShift === "number") horizontalShift = data.verticalShift;
    shiftLoaded = true;
  });

  $effect(() => {
    if (!shiftLoaded) return;
    browser.storage.local.set({ verticalShift: horizontalShift });
    if (!overlayVisible) return;
    browser.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
      if (tab?.id) browser.tabs.sendMessage(tab.id, { type: "UPDATE_SHIFT", shift: horizontalShift });
    });
  });

  let dragging = $state(false);

  async function saveFile(file: File) {
    if (!file || !file.type.startsWith("image/")) return;
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    await browser.storage.local.set({
      overlayImage: { name: file.name, data: base64 },
    });
  }

  async function handleFileChange(event) {
    await saveFile(event.target.files[0]);
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    dragging = true;
  }

  function handleDragLeave() {
    dragging = false;
  }

  async function handleDrop(event: DragEvent) {
    event.preventDefault();
    dragging = false;
    const file = event.dataTransfer?.files[0];
    if (file) await saveFile(file);
  }

  async function showImageOnWebsite() {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    try {
      await browser.tabs.sendMessage(tab.id!, { type: "SHOW_OVERLAY", shift: horizontalShift });
      overlayVisible = true;
    } catch (err) {
      console.error("Kein Content Script:", err);
    }
  }

  async function removeImageFromWebsite() {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    try {
      await browser.tabs.sendMessage(tab.id!, { type: "HIDE_OVERLAY" });
      overlayVisible = false;
    } catch (err) {
      console.error("Kein Content Script:", err);
    }
  }
</script>

<div class="popup">
  <header>
    <span class="title">Image Overlay</span>
  </header>

  <div class="body">
    <section
      class="preview-section"
      class:dragging
      ondragover={handleDragOver}
      ondragleave={handleDragLeave}
      ondrop={handleDrop}
      role="region"
      aria-label="Bild-Vorschau und Drop-Zone"
    >
      {#if dragging}
        <div class="preview-empty">Loslassen zum Einfügen</div>
      {:else if overlayImageObject != null}
        <img src={overlayImageObject.data} alt={overlayImageObject.name} class="preview-img" />
        <span class="filename">{overlayImageObject.name}</span>
      {:else}
        <div class="preview-empty">Bild hierher ziehen</div>
      {/if}
    </section>

    <label class="upload-btn">
      Bild auswählen
      <input type="file" accept="image/*" onchange={handleFileChange} />
    </label>

    <div class="field">
      <label class="field-label" for="shiftInput">Vertikale Verschiebung</label>
      <div class="input-group">
        <input id="shiftInput" class="number-input" type="number" bind:value={horizontalShift} />
        <span class="input-unit">rem</span>
      </div>
    </div>

    <div class="actions">
      <button class="btn btn-primary" onclick={showImageOnWebsite}>Einblenden</button>
      <button class="btn btn-secondary" onclick={removeImageFromWebsite}>Ausblenden</button>
    </div>
  </div>
</div>

<style>
  .popup {
    width: 100%;
    background: #242424;
    color: rgba(255, 255, 255, 0.87);
  }

  header {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 1px solid #333;
  }

  .title {
    font-size: 13px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.87);
    letter-spacing: 0.01em;
  }

  .body {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 14px 16px;
  }

  .preview-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 8px;
    padding: 12px;
    min-height: 80px;
    justify-content: center;
  }

  .preview-section.dragging {
    border-color: #fcba03;
    background: #1f1c10;
  }

  .preview-img {
    max-width: 100%;
    max-height: 100px;
    object-fit: contain;
    border-radius: 4px;
  }

  .filename {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.4);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }

  .preview-empty {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.3);
  }

  .upload-btn {
    display: block;
    text-align: center;
    padding: 7px 12px;
    border-radius: 6px;
    border: 1px solid transparent;
    background: #1a1a1a;
    font-size: 12px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.87);
    cursor: pointer;
    transition: border-color 0.25s;
  }

  .upload-btn:hover {
    border-color: #fcba03;
  }

  .upload-btn input {
    display: none;
  }

  .field {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .field-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    white-space: nowrap;
  }

  .input-group {
    display: flex;
    align-items: center;
    background: #1a1a1a;
    border: 1px solid transparent;
    border-radius: 6px;
    overflow: hidden;
    transition: border-color 0.25s;
  }

  .input-group:focus-within {
    border-color: #fcba03;
  }

  .number-input {
    width: 56px;
    padding: 6px 8px;
    background: transparent;
    border: none;
    color: rgba(255, 255, 255, 0.87);
    font-size: 12px;
    font-family: inherit;
    outline: none;
    text-align: right;
    -moz-appearance: textfield;
  }

  .number-input::-webkit-inner-spin-button,
  .number-input::-webkit-outer-spin-button {
    opacity: 0.4;
  }

  .input-unit {
    padding: 0 8px 0 2px;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.3);
  }

  .actions {
    display: flex;
    gap: 8px;
  }

  .btn {
    flex: 1;
    padding: 7px 12px;
    border-radius: 6px;
    border: 1px solid transparent;
    font-size: 12px;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    transition: border-color 0.25s;
  }

  .btn-primary {
    background: #fcba03;
    color: #1a1a1a;
  }

  .btn-primary:hover {
    border-color: #e0a500;
    background: #e0a500;
  }

  .btn-secondary {
    background: #1a1a1a;
    color: rgba(255, 255, 255, 0.87);
  }

  .btn-secondary:hover {
    border-color: #fcba03;
  }
</style>
