<script lang="ts">
  import cookie from "js-cookie";

  let isRegister: boolean = false;

  let password: string;
  let username: string;
  let accessKey: string;
  let secretKey: string;
  let bucket: string;
  let admin: string;
  let endpoint: string;

  let error = {
    active: false,
    text: "",
  } as { active: boolean; text?: string };

  function resetForm() {
    password = "";
    username = "";
  }

  async function auth() {
    if (!password || !username) {
      return (error = { active: true, text: `Введите ${!username ? "имя пользователя" : "пароль"}!` });
    }

    error.active = false;

    const apiRequest = await fetch("/api/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ password, username, admin, accessKey, secretKey, bucket, endpoint }),
    });

    const response = await apiRequest.json();

    if (response.error) {
      error.active = true;
      error.text = response?.text ?? "Неизвестная ошибка!";
    } else {
      cookie.set("token", response.token, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24), path: "/" });

      window.location.href = "/";
    }

    resetForm();
  }
</script>

<div class="hero min-h-screen bg-base-300 select-none">
  <div class="hero-content text-center">
    <div class="card rounded sm:w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="text-xl outline-none text-center">{isRegister ? "Регистрация" : "Авторизация"}</h2>

        <div class="form-control w-full">
          <span class="label label-text">Имя пользователя</span>
          <input type="text" bind:value={username} class="input-sm rounded input input-bordered w-full" required />
        </div>

        <div class="form-control w-full">
          <span class="label label-text">Пароль</span>
          <input type="password" bind:value={password} class="input-sm rounded input input-bordered w-full" required />
        </div>

        {#if isRegister}
          <div class="form-control w-full">
            <span class="label label-text">S3 Access Key</span>
            <input type="text" bind:value={accessKey} class="input-sm rounded input input-bordered w-full" required />
          </div>

          <div class="form-control w-full">
            <span class="label label-text">S3 Secret Key</span>
            <input
              type="password"
              bind:value={secretKey}
              class="input-sm rounded input input-bordered w-full"
              required
            />
          </div>

          <div class="form-control w-full">
            <span class="label label-text">Название Bucket'a</span>
            <input type="text" bind:value={bucket} class="input-sm rounded input input-bordered w-full" required />
          </div>

          <div class="form-control w-full">
            <span class="label label-text">S3 Endpoint</span>
            <input type="text" bind:value={endpoint} class="input-sm rounded input input-bordered w-full" required />
          </div>

          <div class="form-control w-full">
            <span class="label label-text">Админ-пароль</span>
            <input type="password" bind:value={admin} class="input-sm rounded input input-bordered w-full" required />
          </div>
        {/if}

        {#if error.active}
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
          <button
            on:click={() => (isRegister ? (isRegister = false) : (isRegister = true))}
            class="btn rounded btn-outline btn-error btn-sm">{isRegister ? "Отмена" : "Регистрация"}</button
          >

          <button on:click={async () => await auth()} class="btn rounded btn-outline btn-access btn-sm"
            >{isRegister ? "Создать" : "Войти"}</button
          >
        </div>
      </div>
    </div>
  </div>
</div>
