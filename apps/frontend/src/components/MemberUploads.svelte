<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import axios from "axios";
  import { formatBytes } from "bytes-formatter";
  import { _ } from "svelte-i18n";
  import type { Member, Response } from "../helpers/interfaces";
  import { fileType, files } from "../helpers/store";
  import { toastError, toastInfo } from "../helpers/toasts";

  export let member: Member;
  let response: Response["uploads"];
  let newFileTag = "" as string;

  files.subscribe((data) => {
    response = data;
  });

  function ext(name: string) {
    const extReg = /(?:\.([^.]+))?$/;
    const ext = extReg.exec(name)![1].toLowerCase();

    if (ext == "png" || ext == "jpg" || ext == "jpeg") return true;

    return false;
  }

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

    return toast.push($_("other.file.downloading"), toastInfo);
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
      toast.push(answer?.text ?? $_("errors.file.delete", { values: { name } }), toastError);
    } else {
      files.update((files) => response.filter((upload) => upload.id !== id));

      toast.push($_("info.delete.one", { values: { name } }), toastInfo);
    }
  }

  async function deleteTag(fileID: string, tag: string) {
    const apiRequest = await fetch("/api/tag/file", {
      method: "DELETE",
      body: JSON.stringify({ fileID, tag }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const answer = await apiRequest.json();

    if (answer.error) {
      toast.push(answer?.text ?? $_("errors.delete.tagError", { values: { tag } }), toastError);
    } else {
      response = response.filter((x) => x.id !== fileID);
      response.push(answer.file);

      toast.push($_("info.delete.tag", { values: { tag } }), toastInfo);
    }
  }

  async function addFileTag(fileID: string) {
    const tag = newFileTag;

    const apiRequest = await fetch("/api/tag/file", {
      method: "POST",
      body: JSON.stringify({ fileID, tag }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const answer = await apiRequest.json();

    if (answer.error) {
      toast.push(answer?.text ?? $_("errors.delete.tagAddError", { values: { tag } }), toastError);
    } else {
      response = response.filter((x) => x.id !== fileID);
      response.push(answer.file);

      toast.push($_("info.add.tag", { values: { tag } }), toastInfo);
    }
  }

  let fileTypeDisplay = true;

  fileType.subscribe((x) => {
    fileTypeDisplay = x;
  });
</script>

{#if fileTypeDisplay}
  <div class="mt-5 grid gap-[0.75rem] sm:grid-cols-1 md:grid-cols-2 md:px-1 lg:grid-cols-4">
    {#each response as upload}
      <div class="card card-compact bg-base-300 flex flex-col rounded shadow-lg">
        {#if member.member.showPreview}
          <figure>
            {#if ext(upload.name)}
              <img loading="lazy" src={upload.url} alt="preview" class="select-none" />
            {:else}
              <svg
                class="h-64 w-64"
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
              {$_("other.uploaded", { values: { date: new Date(upload.createdAt).toLocaleString() } })}
            </p>
            <p>{$_("other.size", { values: { size: formatBytes(upload.size) } })}</p>
          </div>

          <div class="select-none">
            <div class="flex justify-between">
              <p>{$_("other.file.tagFile")}</p>

              <div>
                <select
                  tabindex={Date.now()}
                  class="select select-sm [--rounded-btn:0.25rem] {!member.member?.tags.length ? 'hidden' : 'block'}"
                  bind:value={newFileTag}
                  on:change={async () => await addFileTag(upload.id)}
                >
                  {#each member.member?.tags as tag}
                    <option>{tag}</option>
                  {/each}
                </select>
              </div>
            </div>
            {#if upload?.tags?.length}
              {#each upload?.tags as tag}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div
                  class="badge badge-ghost hover:badge-outline m-0.5"
                  on:click={async () => await deleteTag(upload.id, tag)}
                >
                  {tag}
                </div>
              {/each}
            {/if}
          </div>
        </div>

        <div class="mx-1 my-2 space-y-1">
          <div class="flex">
            <a href={upload.url} target="_blank" class="btn btn-sm btn-outline btn-success mr-1 w-1/2 rounded"
              >{$_("buttons.open")}</a
            >
            <button
              on:click={async () => await downloadFile(upload.url, upload.name)}
              class="btn btn-sm btn-outline btn-accent flex-1 rounded">{$_("buttons.download")}</button
            >
          </div>

          <button
            on:click={async () => await deleteFile(upload.id, upload.name)}
            class="btn btn-sm btn-outline btn-error w-full rounded">{$_("buttons.delete")}</button
          >
        </div>
      </div>
    {/each}
  </div>
{:else}
  <div class="select-none overflow-x-auto">
    <table class="table-zebra table w-full rounded">
      <thead>
        <tr>
          <th class="bg-base-300">{$_("table.filename")}</th>
          <th class="bg-base-300">{$_("table.uploaded")}</th>
          <th class="bg-base-300">{$_("table.size")}</th>
          <th class="bg-base-300">{$_("table.tags")}</th>
          <th class="bg-base-300 text-center">{$_("table.actions")}</th>
        </tr>
      </thead>
      <tbody>
        {#each response as upload}
          <tr>
            <td>
              {upload.name.length >= 15
                ? upload.name.slice(0, 15) + "..." + upload.name.split(".").pop()
                : upload.name}</td
            >
            <td>{new Date(upload.createdAt).toLocaleString()}</td>
            <td>{formatBytes(upload.size)}</td>
            <td class="max-h-16 overflow-y-auto">
              {#if upload?.tags?.length}
                {#each upload?.tags as tag}
                  <!-- svelte-ignore a11y-no-static-element-interactions -->
                  <!-- svelte-ignore a11y-click-events-have-key-events -->
                  <div
                    class="badge badge-ghost hover:badge-outline m-0.5 flex"
                    on:click={async () => await deleteTag(upload.id, tag)}
                  >
                    {tag}
                  </div>
                {/each}
              {/if}
            </td>
            <td class="flex justify-center">
              <div class="flex space-x-2">
                <a href={upload.url} target="_blank" class="btn btn-sm btn-outline btn-success rounded"
                  >{$_("buttons.open")}</a
                >
                <button
                  on:click={async () => await downloadFile(upload.url, upload.name)}
                  class="btn btn-sm btn-outline btn-accent rounded">{$_("buttons.download")}</button
                >

                <button
                  on:click={async () => await deleteFile(upload.id, upload.name)}
                  class="btn btn-sm btn-outline btn-error rounded">{$_("buttons.delete")}</button
                >
                <div>
                  <select
                    tabindex={Date.now()}
                    class="select select-sm [--rounded-btn:0.25rem] {!member.member?.tags.length ? 'hidden' : 'block'}"
                    bind:value={newFileTag}
                    on:change={async () => await addFileTag(upload.id)}
                  >
                    {#each member.member?.tags as tag}
                      <option>{tag}</option>
                    {/each}
                  </select>
                </div>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
{/if}
