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

<div class="card card-border card-sm border-base-content/10 bg-base-200 w-full shadow-lg select-none">
  <div class="card-body gap-4">
    <h2 class="card-title text-base-content flex flex-wrap items-center gap-2 text-lg font-bold outline-none">
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <svg
        on:click={() => panelDisplay()}
        class="btn btn-xs btn-outline h-7 w-7"
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
      <div class="flex flex-col gap-4">
        <label class="label flex cursor-pointer items-center justify-between gap-4 py-1">
          <span class="text-base-content text-sm font-medium">{$_("other.preview")}</span>
          <input
            type="checkbox"
            on:click={async () => await filePreview()}
            class="toggle toggle-primary"
            checked={member.member?.showPreview}
          />
        </label>

        <div class="label flex cursor-pointer items-center justify-between gap-4 py-1">
          <span class="text-base-content text-sm font-medium">Uploads display type</span>

          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div class="text-base-content hover:text-warning" on:click={() => uploadVisiblityType()}>
            <svg
              class="h-6 w-6 {localToggle ? 'hidden' : 'block'}"
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
              class="h-6 w-6 {localToggle ? 'block' : 'hidden'}"
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

        <div class="label flex cursor-pointer items-center justify-between gap-4 py-1">
          <span class="text-base-content text-sm font-medium">{$_("buttons.delete")}</span>
          <label for="delete_files" class="btn btn-outline btn-error btn-sm shrink-0 rounded"
            ><svg
              class="h-6 w-6"
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
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-base-content text-sm font-medium">{$_("other.lang.title")}</span>
        <select
          class="select select-sm w-full max-w-full"
          bind:value={lang}
          on:change={async () => await updateLanguage()}
        >
          <option disabled selected>{$_("other.lang.body")}</option>
          {#each $locales as locale}
            <option value={locale}>{$_("name", { locale })}</option>
          {/each}
        </select>
      </div>

      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span class="text-base-content text-sm font-medium">{$_("other.tag.title")}</span>
        <label for="add_tags" class="btn btn-outline btn-success btn-sm shrink-0 rounded"
          ><svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
            ><path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            /></svg
          ></label
        >
      </div>

      <div class="{member.member?.tags.length > 0 ? 'max-h-32' : ''} flex flex-wrap gap-1 overflow-y-auto pb-1">
        {#if member.member?.tags.length > 0}
          {#each member.member?.tags as tag}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="badge badge-ghost hover:badge-outline m-0.5" on:click={() => removeTag(tag)}>{tag}</div>
          {/each}
        {/if}
      </div>

      <div class="card-actions border-base-content/10 flex-col items-stretch justify-start border-t pt-4">
        <form class="flex w-full flex-col gap-2" on:submit|preventDefault={async () => await getFiles()}>
          <span class="text-base-content text-sm font-medium">{$_("other.file.search")}</span>
          <div class="join join-horizontal w-full">
            <input
              type="text"
              placeholder={$_("other.file.placeholder")}
              class="input input-sm join-item min-w-0 flex-1"
              bind:value={search}
            />
            {#if member.member?.tags.length > 0}
              <select class="select select-sm join-item w-auto max-w-40 min-w-24 shrink-0" bind:value={tagKey}>
                <option selected>-</option>
                {#each member.member?.tags as tag}
                  <option value={tag}>{tag}</option>
                {/each}
              </select>
            {/if}
            <button type="submit" class="btn btn-sm btn-error join-item shrink-0">{$_("buttons.find")}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

<input type="checkbox" id="add_tags" class="modal-toggle" />
<div class="modal">
  <div class="modal-box border-base-content/10 bg-base-200 relative rounded-xl border shadow-2xl">
    <label for="add_tags" class="btn btn-ghost btn-sm btn-circle absolute top-2 right-2"
      ><svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
        ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg
      ></label
    >
    <h3 class="text-base-content text-lg font-bold">{$_("other.modal.tag.title")}</h3>

    <label class="input input-sm my-4 w-full">
      <input bind:value={tag} type="text" placeholder={$_("other.modal.tag.placeholder")} />
    </label>

    <button class="btn btn-sm btn-success btn-outline w-full rounded" on:click={async () => await addNewTag()}
      >{$_("other.modal.tag.create")}</button
    >
  </div>
</div>
