<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { toastError, toastInfo } from "../helpers/toasts";

  interface Member {
    error: boolean;
    member: {
      id: string;
      createdAt: Date;
      username: string;
      accessKey: string;
      secretKey: string;
      bucket: string;
      endpoint: string;
      showPreview: boolean;
      maxGB: number;
    };
    uploads: {
      size: number;
      count: number;
    };
  }

  export let member: Member;
  let files: FileList;
  let isUploading: boolean = false;
  let uploadLimit = member?.uploads?.size + 104857600 >= member?.member?.maxGB * Math.pow(1024, 3) ? true : false;

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

      return toast.push(response?.text ?? `Произошла ошибка во время загрузки файлов!`, toastError);
    } else {
      return (document.location.href = "/");
    }
  }
</script>

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
        disabled={uploadLimit ? true : isUploading}>{isUploading ? "Загрузка" : "Загрузить"}</button
      >

      <p class="my-2 {uploadLimit ? 'block' : 'hidden'}">
        Ваш установленный лимит в <span class="font-bold">{member?.member?.maxGB ?? 1} GB</span> будет скоро превышен, т.к
        текущий вес загруженных файлов + зарезервированные 100 мб больше лимита.
      </p>
    </div>
  </div>
</form>
