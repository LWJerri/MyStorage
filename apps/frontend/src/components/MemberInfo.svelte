<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { formatBytes } from "bytes-formatter";
  import { _ } from "svelte-i18n";
  import type { Member } from "../helpers/interfaces";
  import { infoPanel } from "../helpers/nanostore";
  import { toastError, toastInfo } from "../helpers/toasts";

  let isEditing: boolean = false;

  export let newInfo: Member["member"] & { password?: string };
  export let member: Member;

  async function updateMember() {
    const apiRequest = await fetch("/api/me", {
      method: "PUT",
      body: JSON.stringify(newInfo),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await apiRequest.json();

    if (response.error) {
      toast.push(response?.text ?? $_("errors.member.edit"), toastError);
    } else {
      toast.push($_("info.update.member"), toastInfo);
    }
  }

  function panelDisplay() {
    infoPanel.set(!infoPanel.get());
  }
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
          d={$infoPanel ? "M19 13l-7 7-7-7m14-8l-7 7-7-7" : "M5 11l7-7 7 7M5 19l7-7 7 7"}
        /></svg
      >
      {$_("titles.info")}
      {isEditing ? `(${$_("other.editing").toLowerCase()})` : ""}
    </h2>
    <div class={$infoPanel ? "hidden" : "block"}>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label class="input input-sm input-ghost w-full">
          <span class="label">{$_("other.username")}</span>
          <input
            bind:value={newInfo.username}
            type="text"
            placeholder={member?.member?.username}
            disabled={isEditing ? false : true}
          />
        </label>

        <label class="input input-sm input-ghost w-full">
          <span class="label">{$_("other.passwordData.title")}</span>
          <input
            bind:value={newInfo.password}
            type="password"
            placeholder={$_("other.passwordData.placeholder")}
            disabled={isEditing ? false : true}
          />
        </label>

        <label class="input input-sm input-ghost w-full">
          <span class="label">{$_("other.accessKey")}</span>
          <input
            bind:value={newInfo.accessKey}
            type="text"
            placeholder={member?.member?.accessKey}
            disabled={isEditing ? false : true}
          />
        </label>

        <label class="input input-sm input-ghost w-full">
          <span class="label">{$_("other.secretKey")}</span>
          <input
            bind:value={newInfo.secretKey}
            type="password"
            placeholder={(member?.member?.secretKey?.slice(0, 10) ?? "") + "***"}
            disabled={isEditing ? false : true}
          />
        </label>

        <label class="input input-sm input-ghost w-full">
          <span class="label">{$_("other.s3Bucket")}</span>
          <input
            bind:value={newInfo.bucket}
            type="text"
            placeholder={member?.member?.bucket}
            disabled={isEditing ? false : true}
          />
        </label>

        <label class="input input-sm input-ghost w-full">
          <span class="label">{$_("other.s3Endpoint")}</span>
          <input
            bind:value={newInfo.endpoint}
            type="text"
            placeholder={member?.member?.endpoint}
            disabled={isEditing ? false : true}
          />
        </label>

        <div class="flex flex-col gap-2 md:col-span-2">
          <div class="flex flex-wrap items-center gap-2">
            <span class="label p-0">{$_("other.space")}</span>
            <svg
              class="text-error h-5 w-5 shrink-0 {member?.uploads?.size > 0 &&
              member?.uploads?.size + 10737418240 >= (member?.member?.maxGB ?? 0) * Math.pow(1024, 3)
                ? 'block'
                : 'hidden'}"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              /></svg
            >
          </div>
          <div class="join join-horizontal w-full">
            <input
              type="text"
              value={formatBytes(member?.uploads?.size ?? 0)}
              class="input input-sm input-ghost join-item min-w-0 flex-1"
              disabled
            />
            <input
              type="number"
              bind:value={newInfo.maxGB}
              min="1"
              class="input input-sm input-ghost join-item w-32 shrink-0"
              placeholder="MAX {member?.member?.maxGB.toString()} GB"
              disabled={isEditing ? false : true}
            />
          </div>
        </div>

        <label class="input input-sm input-ghost w-full">
          <span class="label">{$_("other.file.total")}</span>
          <input type="text" value={member?.uploads?.count} disabled />
        </label>
      </div>

      <div class="card-actions mt-6 justify-end gap-2">
        <button
          class="btn btn-outline btn-sm btn-error rounded"
          on:click={async () => {
            isEditing ? (isEditing = false) : (isEditing = true);

            if (!isEditing) return await updateMember();
          }}>{isEditing ? $_("buttons.save") : $_("buttons.edit")}</button
        >
      </div>
    </div>
  </div>
</div>
