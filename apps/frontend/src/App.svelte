<script lang="ts">
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import { Route, Router } from "svelte-navigator";
  import Join from "./pages/Join.svelte";
  import Main from "./pages/Main.svelte";
</script>

<Router>
  <main>
    <SvelteToast />

    <Route path="/join" component={Join} />
    <Route component={Main} />
  </main>
</Router>
