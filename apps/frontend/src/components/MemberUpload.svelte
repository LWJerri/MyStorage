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

<form on:submit|preventDefault={async () => await uploadFiles()} class="my-5">
  <div class="flex justify-center px-1">
    <div class="w-96">
      <input
        bind:files
        class="form-control my-1 block w-full rounded text-white"
        type="file"
        name="files"
        multiple
        required
      />

      {#if member.member?.tags.length > 0}
        <div class="form-control my-5">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="label">
            <span class="label-text">{$_("other.file.upload.tag")}</span>
          </label>

          <div class="test">
            <Select items={member.member?.tags} bind:value={tags} />
          </div>
        </div>
      {/if}

      <button
        type="submit"
        class="btn btn-sm btn-outline btn-error my-1 w-full rounded {isUploading ? 'loading' : ''}"
        disabled={uploadLimit ? true : isUploading}
        >{isUploading ? $_("buttons.progress.uploading") : $_("buttons.upload")}</button
      >

      <p class="my-2 {uploadLimit ? 'block' : 'hidden'}">
        {$_("info.limit", { values: { max: member?.member?.maxGB ?? 1 } })}
      </p>
    </div>
  </div>
</form>

<style>
  .test {
    --inputColor: black;
    --itemColor: black;
    --itemHoverColor: black;
    --background: #191a21;
    --multiClearBG: black;
    --multiClearHoverBG: black;
    --multiItemActiveBG: white;
    --multiItemActiveColor: black;
    --multiItemBG: black;
  }
</style>
