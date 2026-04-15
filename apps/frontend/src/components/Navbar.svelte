<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { _ } from "svelte-i18n";
  import type { Logout, Member } from "../helpers/interfaces";
  import { toastError } from "../helpers/toasts";
  import MemberUpload from "./MemberUpload.svelte";

  export let member: Member;

  async function logOut() {
    const apiRequest = await fetch("/api/logout", { method: "POST" });

    const response = (await apiRequest.json()) as Logout;

    if (response.error) return toast.push(response?.text ?? $_("errors.member.logout"), toastError);

    return (document.location.href = "/join");
  }
</script>

<div
  class="navbar border-base-content/10 bg-base-300 text-base-content mb-4 border-b shadow-none select-none sm:rounded-b-xl"
>
  <div class="navbar-start">
    <a
      href="/"
      class="text-base-content px-2 text-xl font-bold tracking-tight transition-opacity hover:opacity-80"
      translate="no">MyStorage</a
    >
  </div>

  <div class="navbar-end gap-2">
    <div class="hidden items-center gap-2 sm:flex">
      <label for="upload" class="btn btn-sm btn-outline btn-success rounded">{$_("buttons.upload")}</label>
      <button type="button" class="btn btn-outline btn-sm btn-error rounded" on:click={() => logOut()}
        >{$_("buttons.logout")}</button
      >
    </div>

    <div class="sm:hidden">
      <label for="menu" class="btn btn-ghost btn-square rounded-md"
        ><svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
          ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" /></svg
        ></label
      >
    </div>
  </div>
</div>

<input type="checkbox" id="menu" class="modal-toggle" />
<div class="modal modal-bottom" role="dialog">
  <div class="modal-box border-base-content/10 bg-base-200 relative flex flex-col gap-3 rounded-xl border">
    <label for="upload" class="btn btn-outline btn-success btn-sm w-full rounded">{$_("buttons.upload")}</label>
    <button type="button" class="btn btn-outline btn-error btn-sm w-full rounded" on:click={() => logOut()}
      >{$_("buttons.logout")}</button
    >
  </div>
  <label class="modal-backdrop" for="menu"></label>
</div>

<input type="checkbox" id="upload" class="modal-toggle" />
<div class="modal">
  <div class="modal-box border-base-content/10 bg-base-200 relative rounded-xl border shadow-2xl">
    <label for="upload" class="btn btn-ghost btn-sm btn-circle absolute top-2 right-2"
      ><svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
        ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg
      ></label
    >

    <MemberUpload {member} />
  </div>
</div>
