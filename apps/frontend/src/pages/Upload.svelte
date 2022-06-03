<script lang="ts">
  import cookie from "js-cookie";
  import { onMount } from "svelte";
  import Navbar from "../components/Navbar.svelte";

  const token = cookie.get("token");

  onMount(() => {
    if (!cookie.get("token")) {
      document.location.href = "/join";
    }
  });
</script>

<div>
  <Navbar />

  <form
    class="my-5"
    action="/api/file?token={token}"
    method="post"
    accept-charset="UTF-8"
    enctype="multipart/form-data"
  >
    <div class="flex justify-center px-1">
      <div class="w-96">
        <input class="form-control block w-full text-white rounded my-1" type="file" name="files" multiple required />

        <button type="submit" class="btn btn-sm w-full my-1 btn-outline btn-error rounded">Загрузить</button>
      </div>
    </div>
  </form>
</div>
