<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { toastError, toastInfo } from "../helpers/toasts";
  import { onMount } from "svelte";
  import Navbar from "../components/Navbar.svelte";

  let files: FileList;
  let isUploading: boolean = false;

  async function uploadFiles() {
    isUploading = true;
    toast.push(`Загрузка файлов, пожалуйста, подождите...`, { ...toastInfo, duration: 10000 });

    const data = new FormData();

    for (const file of files) {
      data.append("files[]", file, file.name);
    }

    const apiRequest = await fetch("/api/file", {
      method: "POST",
      body: data,
    });

    const response = await apiRequest.json();

    if (response.error) {
      isUploading = false;

      return toast.push(`Произошла ошибка во время загрузки файлов!`, toastError);
    } else {
      return (document.location.href = "/");
    }
  }

  async function getMember() {
    const apiRequest = await fetch("/api/me", {
      method: "GET",
    });

    const response = await apiRequest.json();

    if (response.error) return (document.location.href = "/join");
  }

  onMount(async () => {
    await getMember();
  });
</script>

<div>
  <Navbar />

  <form on:submit|preventDefault={async () => await uploadFiles()} class="my-5">
    <div class="flex justify-center px-1">
      <div class="w-96">
        <input
          bind:files
          class="form-control block w-full text-white rounded my-1"
          type="file"
          name="files"
          multiple
          required
        />

        <button
          type="submit"
          class="btn btn-sm w-full my-1 btn-outline btn-error rounded {isUploading ? 'loading' : ''}"
          disabled={isUploading}>{isUploading ? "Загрузка" : "Загрузить"}</button
        >
      </div>
    </div>
  </form>
</div>
