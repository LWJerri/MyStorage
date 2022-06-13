import { addMessages, init } from "svelte-i18n";

import ukrainian from "../locales/ukrainian.json";
import russian from "../locales/russian.json";
import english from "../locales/english.json";

addMessages("ukrainian", ukrainian);
addMessages("russian", russian);
addMessages("english", english);

const memberLang = window.localStorage.getItem("lang");

init({
  fallbackLocale: "russian",
  initialLocale: memberLang,
});
