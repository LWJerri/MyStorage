<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { toastInfo } from "../helpers/toasts";

  interface RegisterOrLogin {
    password: string;
    username: string;
    accessKey: string;
    secretKey: string;
    bucket: string;
    admin: string;
    endpoint: string;
  }

  interface Error {
    error: boolean;
    text?: string;
  }

  let isRegister: boolean = false;

  let error = {
    error: false,
    text: "",
  } as Error;

  let data = {
    password: "",
    username: "",
    accessKey: "",
    secretKey: "",
    bucket: "",
    admin: "",
    endpoint: "",
  } as RegisterOrLogin;

  function resetForm() {
    data = {
      password: "",
      username: "",
      accessKey: "",
      secretKey: "",
      bucket: "",
      admin: "",
      endpoint: "",
    };
  }

  async function auth() {
    if (!data.password || !data.username) {
      return (error = { error: true, text: `Введите ${!data.username ? "имя пользователя" : "пароль"}!` });
    }

    const apiRequest = await fetch("/api/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ ...data }),
    });

    const response = (await apiRequest.json()) as Response & Error;

    resetForm();

    if (response.error) {
      error.error = true;
      error.text = response?.text ?? "Неизвестная ошибка!";
    } else {
      error.error = false;
      if (isRegister) return toast.push(`Пользователь ${data.username} создан!`, toastInfo);

      return (window.location.href = "/");
    }
  }
</script>

<div class="hero min-h-screen select-none">
  <div class="hero-content w-full text-center">
    <div class="card rounded w-full md:w-96 bg-base-300 shadow-xl">
      <div class="card-body">
        <h2 class="text-xl outline-none text-center">{isRegister ? "Регистрация" : "Авторизация"}</h2>

        <form on:submit|preventDefault={async () => await auth()}>
          <div class="form-control w-full">
            <span class="label label-text">Имя пользователя</span>
            <input type="text" bind:value={data.username} class="input-sm rounded input input-bordered w-full" />
          </div>

          <div class="form-control w-full">
            <span class="label label-text">Пароль</span>
            <input type="password" bind:value={data.password} class="input-sm rounded input input-bordered w-full" />
          </div>

          {#if isRegister}
            <div class="form-control w-full">
              <span class="label label-text">S3 Access Key</span>
              <input type="text" bind:value={data.accessKey} class="input-sm rounded input input-bordered w-full" />
            </div>

            <div class="form-control w-full">
              <span class="label label-text">S3 Secret Key</span>
              <input type="password" bind:value={data.secretKey} class="input-sm rounded input input-bordered w-full" />
            </div>

            <div class="form-control w-full">
              <span class="label label-text">Название Bucket'a</span>
              <input type="text" bind:value={data.bucket} class="input-sm rounded input input-bordered w-full" />
            </div>

            <div class="form-control w-full">
              <span class="label label-text">S3 Endpoint</span>
              <input type="text" bind:value={data.endpoint} class="input-sm rounded input input-bordered w-full" />
            </div>

            <div class="form-control w-full">
              <span class="label label-text">Админ-пароль</span>
              <input type="password" bind:value={data.admin} class="input-sm rounded input input-bordered w-full" />
            </div>
          {/if}

          {#if error.error}
            <div class="mt-5 alert rounded alert-error alert-sm shadow-lg">
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
                <span>{error.text}</span>
              </div>
            </div>
          {/if}

          <div class="card-actions justify-end mt-5">
            <button class="btn rounded btn-outline btn-access btn-sm">{isRegister ? "Создать" : "Войти"}</button>

            <button
              on:click={() => (isRegister ? (isRegister = false) : (isRegister = true))}
              class="btn rounded btn-outline btn-error btn-sm">{isRegister ? "Отмена" : "Регистрация"}</button
            >
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
