import { addMessages, init } from "svelte-i18n";

import russian from "../locales/russian.json";
import ukrainian from "../locales/ukrainian.json";
import english from "../locales/english.json";

addMessages("russian", russian);
addMessages("ukrainian", ukrainian);
addMessages("english", english);

const memberLang = window.localStorage.getItem("lang");

init({
  fallbackLocale: "russian",
  initialLocale: memberLang,
});
