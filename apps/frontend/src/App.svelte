<script lang="ts">
	import { Route, Router } from "svelte-navigator";
	import Main from "./pages/Main.svelte";
	import Upload from "./pages/Upload.svelte";

	import { SvelteToast } from "@zerodevx/svelte-toast";
</script>

<Router>
	<main>
		<SvelteToast />

		<Route path="/upload" component={Upload} />
		<Route component={Main} />
	</main>
</Router>
