<script lang="ts">
  import cookie from "js-cookie";

  function logOut() {
    cookie.remove("token");

    return (document.location.href = "/join");
  }
</script>

<div class="navbar text-white bg-base-300 shadow-lg select-none">
  <div class="navbar-start">
    <a href="/" class="ml-2 font-bold text-xl outline-none">MyStorage</a>
  </div>

  <div class="navbar-end">
    <div class="flex hidden sm:block">
      <a class="btn btn-outline btn-success rounded" href="/upload">Загрузить</a>
      <button class="btn btn-outline btn-error rounded" on:click={() => logOut()}>Выйти</button>
    </div>

    <div class="block sm:hidden">
      <label for="menu" class="btn modal-button rounded"
        ><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
          ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" /></svg
        ></label
      >
    </div>
  </div>
</div>

<input type="checkbox" id="menu" class="modal-toggle" />
<label for="menu" class="modal modal-bottom cursor-pointer">
  <label class="modal-box relative rounded space-y-1" for="">
    <a class="btn btn-outline btn-success rounded btn-sm w-full" href="/upload">Загрузить</a>
    <button class="btn btn-outline btn-error rounded w-full btn-sm" on:click={() => logOut()}>Выйти</button>
  </label>
</label>
