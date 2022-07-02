<script lang="ts">
  import { onMount } from "svelte";
  import { toast } from "@zerodevx/svelte-toast";
  import Navbar from "../components/Navbar.svelte";
  import { toastError, toastInfo } from "../helpers/toasts";
  import MemberInfo from "../components/MemberInfo.svelte";
  import MemberControl from "../components/MemberControl.svelte";
  import MemberUploads from "../components/MemberUploads.svelte";
  import { files } from "../helpers/store";
  import type { Member, Response } from "../helpers/interfaces";
  import { isLoading, _ } from "svelte-i18n";

  $: response = {} as Response;
  $: member = {} as Member;

  let search: string = "";
  let isAuth: boolean = false;
  let startDeleting: boolean = false;
  let page: number = 1;

  let newInfo = {} as Member["member"] & { password?: string };

  async function getFiles() {
    const apiRequest = await (await fetch(`/api/file?page=${page}`, { method: "GET" })).json();

    response = apiRequest;
    files.update((x) => response.uploads);
  }

  async function getMember() {
    const apiRequest = await fetch("/api/me", {
      method: "GET",
    });

    const response = (await apiRequest.json()) as Member;

    if (response.error) {
      toast.push(response?.text ?? $_("errors.member.get"), toastError);
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
      toast.push(response?.text ?? $_("errors.file.forceDelete"), toastError);
    } else {
      await getFiles();

      toast.push($_("info.delete.force", { values: { count: response.count } }), toastInfo);
    }

    startDeleting = false;
  }

  onMount(async () => {
    await getMember();

    if (!isAuth) {
      document.location.href = "/join";
    }

    window.localStorage.setItem("lang", member.member.language);

    await getFiles();
  });
</script>

{#if $isLoading}
  <div class="hero min-h-screen select-none">
    <div class="hero-content w-full text-center">
      <div class="card rounded w-full md:w-96 bg-base-300 shadow-xl">
        <div class="card-body">
          <h2 class="text-xl outline-none text-center">{$_("other.loading")}</h2>
        </div>
      </div>
    </div>
  </div>
{:else}
  <div>
    <Navbar {member} />

    <div class="grid gap-[0.75rem] mt-5 grid-cols-1 md:grid-cols-2">
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
          class="btn btn-sm btn-success btn-outline rounded {page == 1 ? 'hidden' : 'block'}"
          >{$_("buttons.previous")}</button
        >

        <button
          on:click={async () => {
            page++;
            await getFiles();
          }}
          class="btn btn-sm btn-success btn-outline rounded {response.nextPage ? 'block' : 'hidden'}"
          >{$_("buttons.next")}</button
        >
      </div>

      <MemberUploads {member} />
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
          <span>{$_("errors.file.load")}</span>
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
          <span class="select-none">{$_("other.file.nothing")}</span>
        </div>
      </div>
    {/if}
  </div>
{/if}

<input type="checkbox" id="delete_files" class="modal-toggle" />
<label for="delete_files" class="modal modal-bottom md:modal-middle cursor-pointer">
  <label class="modal-box relative bg-base-300 rounded" for="">
    <label for="delete_files" class="btn btn-sm btn-circle absolute right-2 top-2"
      ><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
        ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg
      ></label
    >
    <h3 class="text-lg font-bold">{$_("other.forceDelete.title")}</h3>
    <p class="py-4">{$_("other.forceDelete.description")}</p>

    <button
      on:click={async () => await forceDeleteFile()}
      class="btn btn-error btn-outline w-full rounded {startDeleting ? 'loading' : ''}"
      disabled={startDeleting}>{startDeleting ? $_("buttons.progress.deleting") : $_("buttons.delete")}</button
    >
  </label>
</label>
