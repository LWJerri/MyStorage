<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { _, locale, locales } from "svelte-i18n";
  import type { Member } from "../helpers/interfaces";
  import { managePanel, uploadDisplay } from "../helpers/nanostore";
  import { fileType, files } from "../helpers/store";
  import { toastError, toastInfo } from "../helpers/toasts";

  export let member: Member;
  export let page: number;
  let search: string;
  let tagKey: string;
  let lang: string;
  let tag: string;
  let localToggle: boolean;

  async function updateLanguage() {
    const apiRequest = await fetch("/api/me", {
      method: "PUT",
      body: JSON.stringify({ language: lang }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await apiRequest.json();

    if (response.error) {
      toast.push(response?.text ?? $_("errors.member.edit"), toastError);
    } else {
      window.localStorage.setItem("lang", lang);
      locale.set(lang);

      toast.push($_("info.update.language"), toastInfo);
    }
  }

  async function filePreview() {
    const apiRequest = await fetch("/api/me", {
      method: "PUT",
      body: JSON.stringify({ showPreview: !member.member.showPreview }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await apiRequest.json();

    if (response.error) {
      toast.push(response?.text ?? $_("errors.previewUpdate"), toastError);
    } else {
      member.member.showPreview = !member.member.showPreview;
      await getFiles();

      toast.push($_("info.update.preview"), toastInfo);
    }
  }

  async function removeTag(tag: string) {
    const apiRequest = await fetch("/api/tag", {
      method: "DELETE",
      body: JSON.stringify({ tag }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await apiRequest.json();

    if (response.error) {
      toast.push(response?.text ?? $_("errors.tagsUpdate"), toastError);
    } else {
      member.member.tags = member.member.tags.filter((x) => x !== tag);
      await getFiles();

      toast.push($_("info.update.tags"), toastInfo);
    }
  }

  async function getFiles() {
    const apiRequest = await fetch(
      `/api/file?page=${page}&key=${search ?? ""}&tagKey=${tagKey == "-" || !member.member.tags.length ? "" : tagKey}`,
      {
        method: "GET",
      },
    );
    const response = await apiRequest.json();

    return files.update((x) => response.uploads);
  }

  function panelDisplay() {
    managePanel.set(!managePanel.get());
  }

  async function addNewTag() {
    if (!tag) return toast.push($_("other.tag.void"), toastError);

    const apiRequest = await fetch("/api/tag", {
      method: "POST",
      body: JSON.stringify({ tag }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await apiRequest.json();

    if (response.error) {
      toast.push(response?.text ?? $_("errors.tagsCreate"), toastError);
    } else {
      member.member.tags = response.member.tags;

      tag = "";

      toast.push($_("other.tag.added"), toastInfo);
    }
  }

  function uploadVisiblityType() {
    uploadDisplay.set(!uploadDisplay.get());
    fileType.set(uploadDisplay.get());

    localToggle = uploadDisplay.get();
  }

  fileType.set(uploadDisplay.get());
  localToggle = uploadDisplay.get();
</script>

<div class="card rounded card-compact bg-base-300 select-none">
  <div class="card-body">
    <h2 class="card-title font-bold outline-none">
      <svg
        on:click={() => panelDisplay()}
        class="w-7 h-7 btn btn-xs btn-outline"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d={$managePanel ? "M19 13l-7 7-7-7m14-8l-7 7-7-7" : "M5 11l7-7 7 7M5 19l7-7 7 7"}
        /></svg
      >{$_("titles.manage")}
    </h2>

    <div class={$managePanel ? "hidden" : "block"}>
      <div class="form-control">
        <label class="label cursor-pointer">
          <span class="label-text">{$_("other.preview")}</span>
          <input
            type="checkbox"
            on:click={async () => await filePreview()}
            class="toggle"
            checked={member.member?.showPreview}
          />
        </label>

        <div class="label cursor-pointer">
          <span class="label-text">Uploads display type</span>

          <div class="hover:text-yellow-400" on:click={() => uploadVisiblityType()}>
            <svg
              class="w-6 h-6 {localToggle ? 'hidden' : 'block'}"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              /></svg
            >

            <svg
              class="w-6 h-6 {localToggle ? 'block' : 'hidden'}"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              /></svg
            >
          </div>
        </div>

        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="label cursor-pointer">
          <span class="label-text">{$_("buttons.delete")}</span>
          <label for="delete_files" class="btn btn-outline rounded btn-error btn-sm modal-button"
            ><svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              /></svg
            ></label
          >
        </label>
      </div>

      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="label">
        <span class="label-text">{$_("other.lang.title")}</span>

        <select
          class="select select-sm [--rounded-btn:0.25rem]"
          bind:value={lang}
          on:change={async () => await updateLanguage()}
        >
          <option disabled selected>{$_("other.lang.body")}</option>
          {#each $locales as locale}
            <option value={locale}>{$_("name", { locale })}</option>
          {/each}
        </select>
      </label>

      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="label flex">
        <span class="label-text">{$_("other.tag.title")}</span>
        <label for="add_tags" class="btn btn-outline rounded btn-success btn-sm modal-button"
          ><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            /></svg
          ></label
        >
      </label>

      <div class="{member.member?.tags.length > 0 ? 'max-h-32' : ''} mb-5 overflow-y-auto">
        {#if member.member?.tags.length > 0}
          {#each member.member?.tags as tag}
            <div class="badge badge-ghost hover:badge-outline m-0.5" on:click={() => removeTag(tag)}>{tag}</div>
          {/each}
        {/if}
      </div>

      <div class="card-actions justify-start border-t border-gray-700 pt-2">
        <form on:submit|preventDefault={async () => await getFiles()} class="w-full">
          <span class="label-text">{$_("other.file.search")}</span>
          <label class="input-group mt-2 w-full [--rounded-btn:0.25rem]">
            <input
              type="text"
              placeholder={$_("other.file.placeholder")}
              class="input input-sm rounded w-full"
              bind:value={search}
            />
            {#if member.member?.tags.length > 0}
              <select class="select select-sm max-w-10 overflow-x-auto [--rounded-btn:0rem]" bind:value={tagKey}>
                <option selected>-</option>
                {#each member.member?.tags as tag}
                  <option value={tag}>{tag}</option>
                {/each}
              </select>
            {/if}
            <button class="btn btn-sm btn-error">{$_("buttons.find")}</button>
          </label>
        </form>
      </div>
    </div>
  </div>
</div>

<input type="checkbox" id="add_tags" class="modal-toggle" />
<div class="modal">
  <div class="modal-box rounded bg-base-300 relative">
    <label for="add_tags" class="btn btn-sm btn-circle absolute right-2 top-2"
      ><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
        ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg
      ></label
    >
    <h3 class="text-lg font-bold">{$_("other.modal.tag.title")}</h3>

    <input
      bind:value={tag}
      type="text"
      placeholder={$_("other.modal.tag.placeholder")}
      class="my-5 input ounded input-sm rounded w-full"
    />

    <button class="btn btn-sm btn-success btn-outline w-full rounded" on:click={async () => await addNewTag()}
      >{$_("other.modal.tag.create")}</button
    >
  </div>
</div>
