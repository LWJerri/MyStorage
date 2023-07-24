import { addMessages, init } from "svelte-i18n";

import en from "../locales/en.json";
import ru from "../locales/ru.json";
import uk from "../locales/uk.json";

addMessages("uk", uk);
addMessages("ru", ru);
addMessages("en", en);

const memberLang = window.localStorage.getItem("lang");

init({
  fallbackLocale: "ru",
  initialLocale: memberLang,
});
