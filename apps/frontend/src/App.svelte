<script lang="ts">
  import { Route, Router } from "svelte-navigator";
  import { SvelteToast } from "@zerodevx/svelte-toast";

  import Main from "./pages/Main.svelte";
  import Join from "./pages/Join.svelte";
</script>

<Router>
  <main>
    <SvelteToast />

    <Route path="/join" component={Join} />
    <Route component={Main} />
  </main>
</Router>
