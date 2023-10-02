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

<div class="card card-compact bg-base-300 w-auto select-none rounded">
  <div class="card-body">
    <h2 class="card-title font-bold outline-none">
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
      <div class="grid grid-cols-1 gap-[0.75rem] md:grid-cols-2">
        <div class="form-control w-full">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="label">
            <span class="label-text">{$_("other.username")}</span>
          </label>
          <input
            bind:value={newInfo.username}
            type="text"
            placeholder={member?.member?.username}
            class="input-ghost input input-sm input-bordered w-full rounded"
            disabled={isEditing ? false : true}
          />
        </div>

        <div class="form-control w-full">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="label">
            <span class="label-text">{$_("other.passwordData.title")}</span>
          </label>
          <input
            bind:value={newInfo.password}
            type="password"
            placeholder={$_("other.passwordData.placeholder")}
            class="input-ghost input input-sm input-bordered w-full rounded"
            disabled={isEditing ? false : true}
          />
        </div>

        <div class="form-control w-full">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="label">
            <span class="label-text">{$_("other.accessKey")}</span>
          </label>
          <input
            bind:value={newInfo.accessKey}
            type="text"
            placeholder={member?.member?.accessKey}
            class="input-ghost input input-sm input-bordered w-full rounded"
            disabled={isEditing ? false : true}
          />
        </div>

        <div class="form-control w-full">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="label">
            <span class="label-text">{$_("other.secretKey")}</span>
          </label>
          <input
            bind:value={newInfo.secretKey}
            type="password"
            placeholder={member?.member?.secretKey.slice(0, 10) + "***"}
            class="input-ghost input input-sm input-bordered w-full rounded"
            disabled={isEditing ? false : true}
          />
        </div>

        <div class="form-control w-full">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="label">
            <span class="label-text">{$_("other.s3Bucket")}</span>
          </label>
          <input
            bind:value={newInfo.bucket}
            type="text"
            placeholder={member?.member?.bucket}
            class="input-ghost input input-sm input-bordered w-full rounded"
            disabled={isEditing ? false : true}
          />
        </div>

        <div class="form-control w-full">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="label">
            <span class="label-text">{$_("other.s3Endpoint")}</span>
          </label>
          <input
            bind:value={newInfo.endpoint}
            type="text"
            placeholder={member?.member?.endpoint}
            class="input-ghost input input-sm input-bordered w-full rounded"
            disabled={isEditing ? false : true}
          />
        </div>

        <div class="form-control w-full [--rounded-btn:0.25rem]">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="label">
            <span class="label-text inline-flex"
              >{$_("other.space")}
              <svg
                class="ml-2 h-6 w-6 text-red-500 {member?.uploads?.size > 0 &&
                member?.uploads?.size + 10737418240 >= member.member.maxGB * Math.pow(1024, 3)
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
              ></span
            >
          </label>
          <div class="input-group">
            <input
              type="text"
              value={formatBytes(member?.uploads?.size ?? 0)}
              class="input-ghost input input-sm input-bordered w-full"
              disabled
            />
            <input
              type="number"
              bind:value={newInfo.maxGB}
              min="1"
              class="input input-sm input-ghost w-32"
              placeholder="MAX {member?.member?.maxGB.toString()} GB"
              disabled={isEditing ? false : true}
            />
          </div>
        </div>

        <div class="form-control w-full">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="label">
            <span class="label-text">{$_("other.file.total")}</span>
          </label>
          <input
            type="text"
            value={member?.uploads?.count}
            class="input-ghost input input-sm input-bordered w-full rounded"
            disabled
          />
        </div>
      </div>

      <div class="card-actions mt-5 justify-end">
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
