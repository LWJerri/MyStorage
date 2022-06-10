import App from "./App.svelte";
import "./index.css";
import "./i18n";

const app = new App({
  target: document.getElementById("app"),
});

export default app;
