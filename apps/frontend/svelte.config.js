import { sveltePreprocess } from "svelte-preprocess";

export default {
  preprocess: sveltePreprocess({ postcss: false }),
};
