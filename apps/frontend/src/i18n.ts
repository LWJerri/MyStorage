import { addMessages, init } from "svelte-i18n";

import russian from "../locales/russian.json";

addMessages("russian", russian);

const memberLang = window.localStorage.getItem("lang");

init({
  fallbackLocale: "russian",
  initialLocale: memberLang,
});
