<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { toastError, toastInfo } from "../helpers/toasts";
  import { files } from "../helpers/store";

  interface Member {
    error: boolean;
    member: {
      id: string;
      createdAt: Date;
      username: string;
      accessKey: string;
      secretKey: string;
      bucket: string;
      endpoint: string;
      showPreview: boolean;
      maxGB: number;
    };
    uploads: {
      size: number;
      count: number;
    };
  }

  export let member: Member;
  export let page: number;
  let search: string;

  async function filePreview() {
    member.member.showPreview ? (member.member.showPreview = false) : (member.member.showPreview = true);

    const apiRequest = await fetch("/api/me", {
      method: "PUT",
      body: JSON.stringify({ showPreview: member.member.showPreview }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await apiRequest.json();

    if (response.error) {
      toast.push("Произошла ошибка при изменении параметров предпросмотра!", toastError);
    } else {
      await getFiles();

      toast.push("Параметры предпросмотра успешно изменены!", toastInfo);
    }
  }

  async function getFiles() {
    const apiRequest = await fetch(`/api/file?page=${page}&key=${search ?? ""}`, { method: "GET" });
    const response = await apiRequest.json();

    return files.update((x) => response.uploads);
  }
</script>

<div class="card rounded card-compact bg-base-300 select-none">
  <div class="card-body">
    <h2 class="card-title font-bold outline-none">Управление</h2>

    <div class="form-control">
      <label class="label cursor-pointer">
        <span class="label-text">Отображать превью</span>
        <input
          type="checkbox"
          on:click={async () => await filePreview()}
          class="toggle"
          checked={member.member?.showPreview}
        />
      </label>

      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="label cursor-pointer">
        <span class="label-text">Удалить файлы</span>
        <label for="delete_files" class="btn btn-outline rounded btn-error btn-sm modal-button"
          ><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
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

    <div class="card-actions justify-start border-t border-gray-700 pt-2">
      <form on:submit|preventDefault={async () => await getFiles()} class="w-full">
        <span class="label-text">Поиск файла</span>
        <label class="input-group mt-2">
          <input
            type="text"
            placeholder="Поиск по названию файла"
            class="input input-sm w-full rounded"
            bind:value={search}
          />
          <button class="btn btn-sm btn-error">Найти</button>
        </label>
      </form>
    </div>
  </div>
</div>
