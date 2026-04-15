<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { _, isLoading } from "svelte-i18n";
  import type { Error, RegisterOrLogin } from "../helpers/interfaces";
  import { toastInfo } from "../helpers/toasts";

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
    // if (isRegister || (!isRegister && !data.username)) return (error.error = false);
    // console.log("1");
    if (!data.password || !data.username) {
      return (error = {
        error: true,
        text: $_("errors.credentials", {
          values: { data: !data.username ? $_("other.username").toLowerCase() : $_("other.password").toLowerCase() },
        }),
      });
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
      error.text = response?.text ?? $_("errors.unknown");
    } else {
      error.error = false;
      if (isRegister) return toast.push($_("info.created", { values: { user: data.username } }), toastInfo);

      return (window.location.href = "/");
    }
  }
</script>

<div class="hero bg-base-300 min-h-screen select-none">
  <div class="hero-content w-full max-w-md px-4 text-center sm:px-6">
    {#if $isLoading}
      <div class="card card-border bg-base-200 w-full shadow-2xl">
        <div class="card-body gap-4 py-8">
          <h2 class="text-base-content text-center text-2xl font-semibold">{$_("other.loading")}</h2>
        </div>
      </div>
    {:else}
      <div class="card card-border bg-base-200 w-full shadow-2xl">
        <div class="card-body gap-6 px-2 py-4 sm:px-4">
          <h2 class="text-base-content text-center text-2xl font-semibold tracking-tight">
            {isRegister ? $_("titles.register") : $_("titles.login")}
          </h2>

          <form class="flex w-full flex-col gap-4" on:submit|preventDefault={async () => await auth()}>
            <label class="input input-sm w-full">
              <span class="label">{$_("other.username")}</span>
              <input type="text" bind:value={data.username} />
            </label>

            <label class="input input-sm w-full">
              <span class="label">{$_("other.password")}</span>
              <input type="password" bind:value={data.password} />
            </label>

            {#if isRegister}
              <label class="input input-sm w-full">
                <span class="label">{$_("other.accessKey")}</span>
                <input type="text" bind:value={data.accessKey} />
              </label>

              <label class="input input-sm w-full">
                <span class="label">{$_("other.secretKey")}</span>
                <input type="password" bind:value={data.secretKey} />
              </label>

              <label class="input input-sm w-full">
                <span class="label">{$_("other.s3Bucket")}</span>
                <input type="text" bind:value={data.bucket} />
              </label>

              <label class="input input-sm w-full">
                <span class="label">{$_("other.s3Endpoint")}</span>
                <input type="text" bind:value={data.endpoint} />
              </label>

              <label class="input input-sm w-full">
                <span class="label">{$_("other.adminPassword")}</span>
                <input type="password" bind:value={data.admin} />
              </label>
            {/if}

            {#if error.error}
              <div class="alert alert-error alert-soft alert-sm rounded-lg">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 flex-shrink-0 stroke-current"
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

            <div class="card-actions mt-2 justify-end gap-2 pt-2">
              <button
                type="submit"
                class="btn btn-sm border-base-content/35 text-base-content hover:bg-base-content/[0.07] border-2 bg-transparent font-medium"
                >{isRegister ? $_("buttons.create") : $_("buttons.enter")}</button
              >

              <button type="button" class="btn btn-outline btn-error btn-sm" on:click={() => (isRegister = !isRegister)}
                >{isRegister ? $_("buttons.cancel") : $_("titles.register")}</button
              >
            </div>
          </form>
        </div>
      </div>
    {/if}
  </div>
</div>
