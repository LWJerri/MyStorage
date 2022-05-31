<script lang="ts">
  import Navbar from "../components/Navbar.svelte";

  const API_URL = "https://mystorage-adapter.lwjerri.ml/";
</script>

<div>
  <Navbar />

  <form class="my-5" action={API_URL} method="post" accept-charset="UTF-8" enctype="multipart/form-data">
    <div class="flex justify-center px-1">
      <div class="w-96">
        <input class="form-control block w-full text-white rounded my-1" type="file" name="files" multiple required />
        <input
          type="text"
          value={document.baseURI.replace("/upload", "/api/file/")}
          class="input input-bordered w-full rounded my-1"
          disabled
        />

        <button type="submit" class="btn btn-sm w-full my-1 btn-outline btn-error">Загрузить</button>
      </div>
    </div>
  </form>
</div>
