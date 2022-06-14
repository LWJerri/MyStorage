import { addMessages, init } from "svelte-i18n";

import uk from "../locales/uk.json";
import ru from "../locales/ru.json";
import en from "../locales/en.json";

addMessages("uk", uk);
addMessages("ru", ru);
addMessages("en", en);

const memberLang = window.localStorage.getItem("lang");

init({
  fallbackLocale: "russian",
  initialLocale: memberLang,
});
