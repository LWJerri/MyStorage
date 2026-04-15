import { mount, unmount } from "svelte";
import App from "./App.svelte";
import "./i18n";
import "./index.css";

const target = document.getElementById("app");

if (!target) throw new Error('Missing root element "#app"');

const app = mount(App, { target });

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    void unmount(app);
  });
}

export default app;
