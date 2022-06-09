<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { toastError } from "../helpers/toasts";
  import MemberUpload from "./MemberUpload.svelte";

  export let member;

  interface Logout {
    error: boolean;
    text?: string;
  }

  async function logOut() {
    const apiRequest = await fetch("/api/logout", { method: "POST" });

    const response = (await apiRequest.json()) as Logout;

    if (response.error)
      return toast.push(response?.text ?? "Произошла ошибка при попытке выйти с аккаунта!", toastError);

    return (document.location.href = "/join");
  }
</script>

<div class="navbar text-white bg-base-300 shadow-lg select-none rounded">
  <div class="navbar-start">
    <a href="/" class="ml-2 font-bold text-xl outline-none">MyStorage</a>
  </div>

  <div class="navbar-end">
    <div class="flex hidden sm:block">
      <label for="upload" class="btn btn-outline btn-success rounded">Загрузить</label>
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
    <label for="upload" class="btn btn-outline btn-success rounded btn-sm w-full">Загрузить</label>
    <button class="btn btn-outline btn-error rounded w-full btn-sm" on:click={() => logOut()}>Выйти</button>
  </label>
</label>

<input type="checkbox" id="upload" class="modal-toggle" />

<label for="upload" class="modal cursor-pointer rounded">
  <label class="modal-box relative bg-base-300" for="">
    <label for="upload" class="btn btn-sm btn-circle absolute right-2 top-2"
      ><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
        ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg
      ></label
    >

    <MemberUpload {member} />
  </label>
</label>
