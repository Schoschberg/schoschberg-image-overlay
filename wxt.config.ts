import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: "Image Overlay",
    action: {
      default_title: "Image Overlay",
    },
    permissions: ["storage","scripting","tabs","activeTab"],
    host_permissions: ["<all_urls>"],
  },
  srcDir: 'src',
  modules: ['@wxt-dev/module-svelte'],
});
