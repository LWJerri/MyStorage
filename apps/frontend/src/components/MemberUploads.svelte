<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { formatBytes } from "bytes-formatter";
  import { toastError, toastInfo } from "../helpers/toasts";
  import axios from "axios";
  import { files } from "../helpers/store";

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
  let response: Array<{ id: string; createdAt: Date; size: number; name: string; url: string; key: string }>;

  files.subscribe((data) => {
    response = data;
  });

  async function downloadFile(url: string, name: string) {
    const blob = await axios.get(url, {
      headers: {
        "Content-Type": "application/octet-stream",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
      },
      responseType: "blob",
    });

    const a = document.createElement("a");
    const href = window.URL.createObjectURL(blob.data);

    a.href = href;
    a.download = name;

    a.click();

    return toast.push("Файл скачивается, пожалуйста, подождите!", toastInfo);
  }

  async function deleteFile(id: string, name: string) {
    const apiRequest = await fetch("/api/file", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const answer = await apiRequest.json();

    if (answer.error) {
      toast.push(answer?.text ?? `Произошла ошибка при удалении ${name}!`, toastError);
    } else {
      response = response.filter((upload) => upload.id !== id);

      toast.push(`Файл ${name} удалён!`, toastInfo);
    }
  }
</script>

<div class="grid gap-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-5 md:px-1">
  {#each response as upload}
    <div class="card card-compact bg-base-300 shadow-lg rounded flex flex-col">
      {#if member.member.showPreview}
        <figure>
          {#if upload.name.endsWith(".png") || upload.name.endsWith(".jpg") || upload.name.endsWith(".jpeg")}
            <img loading="lazy" src={upload.url} alt="preview" class="select-none" />
          {:else}
            <svg
              class="w-64 h-64"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              /></svg
            >
          {/if}
        </figure>
      {/if}

      <div class="card-body flex-grow">
        <h2 class="card-title font-bold">
          {upload.name.length >= 15 ? upload.name.slice(0, 15) + "..." + upload.name.split(".").pop() : upload.name}
        </h2>

        <div>
          <p>
            Загружен: {new Date(upload.createdAt).toLocaleString()}
          </p>
          <p>Размер: {formatBytes(upload.size)}</p>
        </div>
      </div>

      <div class="my-2 mx-1 space-y-1">
        <a href={upload.url} target="_blank" class="btn btn-sm btn-outline btn-success rounded w-full">Открыть</a>
        <button
          on:click={async () => await downloadFile(upload.url.replace("http://", "https://"), upload.name)}
          class="btn btn-sm btn-outline btn-accent rounded w-full">Скачать</button
        >

        <button
          on:click={async () => await deleteFile(upload.id, upload.name)}
          class="btn btn-sm btn-outline btn-error rounded w-full">Удалить</button
        >
      </div>
    </div>
  {/each}
</div>
