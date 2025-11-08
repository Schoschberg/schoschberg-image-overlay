import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    background: {
      service_worker: "background.ts"
    },
    permissions: ["runtime","storage","scripting","tabs","activeTab"],
    host_permissions: ["<all_urls>"],
    content_scripts: [
      {
        matches: ["<all_urls>"],
        js: ["content/index.ts"],
      },
    ],
  },
  srcDir: 'src',
  modules: ['@wxt-dev/module-svelte'],
});
