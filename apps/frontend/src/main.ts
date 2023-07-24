import App from "./App.svelte";
import "./i18n";
import "./index.css";

const app = new App({
  target: document.getElementById("app"),
});

export default app;
