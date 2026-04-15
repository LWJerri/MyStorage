<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { _ } from "svelte-i18n";
  import Select from "svelte-select";
  import type { Member, Tag } from "../helpers/interfaces";
  import { toastError, toastInfo } from "../helpers/toasts";

  export let member: Member;
  let files: FileList;
  let isUploading: boolean = false;
  let uploadLimit = member?.uploads?.size + 104857600 >= member?.member?.maxGB * Math.pow(1024, 3) ? true : false;
  let tags: Tag[];
  let fileTags = [] as string[];

  async function uploadFiles() {
    isUploading = true;
    toast.push($_("other.file.uploading"), { ...toastInfo, duration: 10000 });

    const data = new FormData();

    for (const file of files) {
      data.append("files[]", file, file.name);
    }

    tags?.map((x) => {
      return fileTags.push(x.value);
    });

    const apiRequest = await fetch(`/api/file?tags=${fileTags}`, {
      method: "POST",
      body: data,
    });

    const response = await apiRequest.json();

    if (response.error) {
      isUploading = false;

      return toast.push(response?.text ?? $_("errors.file.upload"), toastError);
    } else {
      tags = [];

      return (document.location.href = "/");
    }
  }
</script>

<form class="flex flex-col gap-4 py-2" on:submit|preventDefault={async () => await uploadFiles()}>
  <div class="mx-auto flex w-full max-w-md flex-col gap-4 px-1">
    <input bind:files class="file-input file-input-sm w-full" type="file" name="files" multiple required />

    {#if (member.member?.tags?.length ?? 0) > 0}
      <div class="flex flex-col gap-2">
        <span class="label-text text-base-content">{$_("other.file.upload.tag")}</span>
        <div class="upload-tag-select">
          <Select items={member.member?.tags} bind:value={tags} />
        </div>
      </div>
    {/if}

    <button
      type="submit"
      class="btn btn-sm btn-outline btn-error w-full rounded {isUploading ? 'loading' : ''}"
      disabled={uploadLimit ? true : isUploading}
      >{isUploading ? $_("buttons.progress.uploading") : $_("buttons.upload")}</button
    >

    <p class="text-warning text-center text-sm {uploadLimit ? 'block' : 'hidden'}">
      {$_("info.limit", { values: { max: member?.member?.maxGB ?? 1 } })}
    </p>
  </div>
</form>

<style>
  .upload-tag-select :global(.svelte-select) {
    --background: var(--color-base-100);
    --inputColor: var(--color-base-content);
    --itemColor: var(--color-base-content);
    --itemHoverColor: var(--color-base-content);
    --itemHoverBG: color-mix(in oklab, var(--color-base-content) 12%, transparent);
    --listBackground: var(--color-base-100);
    --listBorder: 1px solid color-mix(in oklab, var(--color-base-content) 18%, transparent);
    --border: 1px solid color-mix(in oklab, var(--color-base-content) 18%, transparent);
    --border-hover: 1px solid color-mix(in oklab, var(--color-base-content) 35%, transparent);
    --multiItemBG: var(--color-base-200);
    --multiItemColor: var(--color-base-content);
    --multiClearBG: var(--color-base-300);
    --multiClearHoverBG: var(--color-base-300);
    --multiItemActiveBG: var(--color-primary);
    --multiItemActiveColor: var(--color-primary-content);
    --icons-color: var(--color-base-content);
    --chevron-color: var(--color-base-content);
  }
</style>
