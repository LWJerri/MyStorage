<script lang="ts">
  import { onMount } from "svelte";
  import { toast } from "@zerodevx/svelte-toast";
  import Navbar from "../components/Navbar.svelte";
  import { toastError, toastInfo } from "../helpers/toasts";
  import MemberInfo from "../components/MemberInfo.svelte";
  import MemberControl from "../components/MemberControl.svelte";
  import MemberUploads from "../components/MemberUploads.svelte";
  import { files } from "../helpers/store";

  interface Response {
    error: boolean;
    uploads: Array<{ id: string; createdAt: Date; size: number; name: string; url: string; key: string }>;
    nextPage: boolean;
  }

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

  $: response = {} as Response;
  $: member = {} as Member;

  let search: string = "";
  let isAuth: boolean = false;
  let startDeleting: boolean = false;
  let page: number = 1;

  let newInfo = {} as {
    username: string;
    password: string;
    accessKey: string;
    secretKey: string;
    bucket: string;
    endpoint: string;
    maxGB: number;
  };

  async function getFiles() {
    const apiRequest = await (await fetch(`/api/file?page=${page}&key=${search ?? ""}`, { method: "GET" })).json();

    response = apiRequest;
    files.update((x) => response.uploads);
  }

  async function getMember() {
    const apiRequest = await fetch("/api/me", {
      method: "GET",
    });

    const response = (await apiRequest.json()) as Member;

    if (response.error) {
      toast.push(`Произошла ошибка при получении данных о пользователе!`, toastError);
    } else {
      member = response;
      isAuth = true;
    }
  }

  async function forceDeleteFile() {
    startDeleting = true;

    const apiRequest = await fetch("/api/file/force", {
      method: "DELETE",
    });

    const response = await apiRequest.json();

    if (response.error) {
      toast.push(`Произошла ошибка при удалении файлов!`, toastError);
    } else {
      await getFiles();

      toast.push(`Удалено ${response.count} файлов!`, toastInfo);
    }

    startDeleting = false;
  }

  onMount(async () => {
    await getMember();

    if (!isAuth) {
      document.location.href = "/join";
    }

    await getFiles();
  });
</script>

<div class="bg-base-200">
  <Navbar />

  <div class="grid gap-1 mt-5 grid-cols-1 md:grid-cols-2">
    <MemberInfo {member} {newInfo} />

    <MemberControl {member} {page} />
  </div>

  {#if response?.uploads?.length > 0 && isAuth}
    <div class="flex justify-center my-2 space-x-1">
      <button
        on:click={async () => {
          page--;
          await getFiles();
        }}
        class="btn btn-sm btn-success btn-outline rounded"
        disabled={page == 1 ? true : false}>Предыдущая</button
      >

      <button
        on:click={async () => {
          page++;
          await getFiles();
        }}
        disabled={response.nextPage ? false : true}
        class="btn btn-sm btn-success btn-outline rounded">Следующая</button
      >
    </div>

    <MemberUploads {member} />

    <div class="flex justify-center my-2 space-x-1">
      <button
        on:click={async () => {
          page--;
          await getFiles();
        }}
        class="btn btn-sm btn-success btn-outline rounded"
        disabled={page == 1 ? true : false}>Предыдущая</button
      >

      <button
        on:click={async () => {
          page++;
          await getFiles();
        }}
        disabled={response.nextPage ? false : true}
        class="btn btn-sm btn-success btn-outline rounded">Следующая</button
      >
    </div>
  {:else if response.error}
    <div class="alert alert-error rounded mt-5">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current flex-shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          /></svg
        >
        <span>Произошла ошибка при загрузке файлов!</span>
      </div>
    </div>
  {:else}
    <div class="alert alert-warning rounded mt-5">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="stroke-current flex-shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          /></svg
        >
        <span class="select-none">Список загруженных файлов пуст!</span>
      </div>
    </div>
  {/if}
</div>

<input type="checkbox" id="delete_files" class="modal-toggle" />
<label for="delete_files" class="modal modal-bottom md:modal-middle cursor-pointer">
  <label class="modal-box relative rounded" for="">
    <label for="delete_files" class="btn btn-sm btn-circle absolute right-2 top-2">X</label>
    <h3 class="text-lg font-bold">Подтвердите удаление</h3>
    <p class="py-4">
      <span class="font-bold">Внимание!</span> Данное действие нельзя отменить, все файлы будут безвозвратно удалены с S3
      и базы данных.
    </p>

    <button
      on:click={async () => await forceDeleteFile()}
      class="btn btn-error btn-outline w-full rounded {startDeleting ? 'loading' : ''}"
      disabled={startDeleting}>{startDeleting ? "Удаление" : "Удалить"}</button
    >
  </label>
</label>
