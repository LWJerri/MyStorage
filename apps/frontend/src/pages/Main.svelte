<script lang="ts">
  import { onMount } from "svelte";
  import fileSize from "filesize";
  import { toast } from "@zerodevx/svelte-toast";
  import Navbar from "../components/Navbar.svelte";

  $: response = {} as {
    error: boolean;
    uploads: Array<{ id: string; createdAt: Date; name: string; size: number; url: string; key: string }>;
  };

  let search;

  onMount(async () => {
    const apiRequest = await (await fetch("/api/file", { method: "GET" })).json();

    response = apiRequest;
  });

  async function deleteFile(id: string, name: string) {
    const apiRequest = await fetch("/api/file", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ id }),
    });

    if (apiRequest.status == 302) {
      response.uploads = response.uploads.filter((upload) => upload.id !== id);

      toast.push(`Файл ${name} удалён!`, {
        theme: {
          "--toastBackground": "#48BB78",
          "--toastBarBackground": "#2F855A",
        },
      });
    } else {
      toast.push(`Произошла ошибка при удалении ${name}!`, {
        theme: {
          "--toastBackground": "#F56565",
          "--toastBarBackground": "#C53030",
        },
      });
    }
  }
</script>

<div>
  <Navbar />

  {#if response?.uploads?.length > 0}
    <div class="mt-5 flex flex-row-reverse px-1">
      <input
        type="text"
        bind:value={search}
        placeholder="Поиск по названию"
        class="input input-sm input-bordered w-96"
      />
    </div>

    <div class="grid gap-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-5 md:px-1">
      {#each search?.length > 0 ? response.uploads.filter((i) => i.name
                .split(".")[0]
                .indexOf(search) !== -1) : response.uploads as upload}
        <div class="card card-compact bg-base-300 shadow-lg rounded flex flex-col">
          <figure>
            {#if upload.url.endsWith(".png") || upload.url.endsWith(".jpg") || upload.url.endsWith(".jpeg")}
              <img src={upload.url} alt="preview" class="select-none" />
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

          <div class="card-body flex-grow">
            <h2 class="card-title font-bold">
              {upload.name.length >= 15 ? upload.name.slice(0, 15) + "..." + upload.name.split(".").pop() : upload.name}
            </h2>

            <div>
              <p>
                Загружен: {new Date(upload.createdAt).toLocaleDateString()}
                {new Date(upload.createdAt).toLocaleTimeString()}
              </p>
              <p>Размер: {fileSize(upload.size)}</p>
            </div>
          </div>

          <div class="my-2 mx-1 space-y-1">
            <a href={upload.url} target="_blank" class="btn btn-sm btn-outline btn-success rounded w-full">Открыть</a>

            <!--<a class="btn btn-sm btn-outline btn-warning rounded w-full" href={upload.url} download>Скачать</a>-->

            <button
              on:click={async () => await deleteFile(upload.id, upload.name)}
              class="btn btn-sm btn-outline btn-error rounded w-full">Удалить</button
            >
          </div>
        </div>
      {/each}
    </div>
  {:else if response.error}
    <div class="alert alert-error shadow-lg">
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
    <div class="alert alert-warning rounded">
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
