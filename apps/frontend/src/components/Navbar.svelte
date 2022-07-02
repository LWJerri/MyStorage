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

<div class="navbar text-white bg-base-300 shadow-lg select-none rounded">
  <div class="navbar-start">
    <a href="/" class="ml-2 font-bold text-xl outline-none" translate="no">MyStorage</a>
  </div>

  <div class="navbar-end">
    <div class="flex hidden sm:block">
      <label for="upload" class="btn btn-outline btn-success rounded">{$_("buttons.upload")}</label>
      <button class="btn btn-outline btn-error rounded" on:click={() => logOut()}>{$_("buttons.logout")}</button>
    </div>

    <div class="block sm:hidden">
      <label for="menu" class="btn modal-button rounded"
        ><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
          ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" /></svg
        ></label
      >
    </div>
  </div>
</div>

<input type="checkbox" id="menu" class="modal-toggle" />
<label for="menu" class="modal modal-bottom cursor-pointer">
  <label class="modal-box relative rounded space-y-1" for="">
    <label for="upload" class="btn btn-outline btn-success rounded btn-sm w-full">{$_("buttons.upload")}</label>
    <button class="btn btn-outline btn-error rounded w-full btn-sm" on:click={() => logOut()}
      >{$_("buttons.logout")}</button
    >
  </label>
</label>

<input type="checkbox" id="upload" class="modal-toggle" />
<div class="modal">
  <div class="modal-box bg-base-300 rounded relative">
    <label for="upload" class="btn btn-sm btn-circle absolute right-2 top-2"
      ><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
        ><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg
      ></label
    >

    <MemberUpload {member} />
  </div>
</div>
