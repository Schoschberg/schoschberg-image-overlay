# Image Overlay

Browser-Extension, die ein Bild halbtransparent über eine beliebige Website legt — zum Abgleichen von Designs mit dem implementierten Frontend.

## Installation

1. Das aktuelle `chrome-mv3.zip` aus dem [Releases-Tab](https://github.com/Schoschberg/schoschberg-image-overlay/releases) herunterladen und entpacken.
2. In Chrome `chrome://extensions` öffnen, Entwicklermodus aktivieren.
3. „Entpackte Erweiterung laden" klicken und den entpackten `chrome-mv3`-Ordner auswählen.

### Alternative: aus den Sources bauen

1. `pnpm install`
2. `pnpm build` (Chrome) oder `pnpm build:firefox`
3. `chrome://extensions` → Entwicklermodus an → „Entpackte Erweiterung laden" → `.output/chrome-mv3` auswählen.

Für die Entwicklung: `pnpm dev` lädt die Extension automatisch in ein Chrome-Testprofil.

## Benutzung

1. Extension-Popup über das Toolbar-Icon öffnen.
2. **Bild laden**: das Bild per **Drag-and-Drop** auf den Datei-Input ziehen. Der normale „Datei auswählen"-Dialog funktioniert aktuell nicht — nur Drop wird unterstützt.
3. **Vertikale Verschiebung in rem** eintragen (z. B. `10` schiebt das Overlay 10 rem nach unten). Der Wert wird im Extension-Storage persistiert.
4. Im Ziel-Tab auf **Show Image** klicken.
   - ⚠️ **Der erste Klick hat keine Wirkung.** Den Button einfach ein zweites Mal klicken — dann erscheint das Overlay.
5. **Remove image** entfernt das Overlay wieder.

Das Overlay wird mit `opacity: 0.3` und `pointer-events: none` eingeblendet, blockiert also keine Klicks auf die darunterliegende Seite.

## Scripts

- `pnpm dev` / `pnpm dev:firefox` — Dev-Modus mit Hot-Reload
- `pnpm build` / `pnpm build:firefox` — Produktions-Build nach `.output/`
- `pnpm zip` / `pnpm zip:firefox` — Build + ZIP zum Upload in den Web-Store
- `pnpm check` — Svelte-/TypeScript-Checks
- `node scripts/gen-icons.mjs` — Extension-PNG-Icons aus `public/favicon.svg` neu rendern

## Stack

WXT · Svelte 5 · TypeScript · Tailwind 4
