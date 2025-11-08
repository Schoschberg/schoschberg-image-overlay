import { mount } from 'svelte';
import { browser} from "wxt/browser";
import App from './App.svelte';
import './app.css';

const app = mount(App, {
  target: document.getElementById('app')!,
});

export default app;
