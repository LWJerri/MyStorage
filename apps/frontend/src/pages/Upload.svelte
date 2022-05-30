<script lang="ts">
  import Navbar from "../components/Navbar.svelte";
</script>

<div>
  <Navbar />

  <form class="my-5" action="/api/file" method="post" accept-charset="UTF-8" enctype="multipart/form-data">
    <div class="flex justify-center px-1">
      <div class="w-96">
        <input class="form-control block w-full text-white rounded" type="file" name="files" multiple required />
      </div>

      <button type="submit" class="ml-2 btn btn-sm btn-outline btn-error">Загрузить</button>
    </div>
  </form>
</div>
