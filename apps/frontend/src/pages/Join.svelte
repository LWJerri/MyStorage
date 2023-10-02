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

<div class="hero min-h-screen select-none">
  <div class="hero-content w-full text-center">
    {#if $isLoading}
      <div class="card bg-base-300 w-full rounded shadow-xl md:w-96">
        <div class="card-body">
          <h2 class="text-center text-xl outline-none">{$_("other.loading")}</h2>
        </div>
      </div>
    {:else}
      <div class="card bg-base-300 w-full rounded shadow-xl md:w-96">
        <div class="card-body">
          <h2 class="text-center text-xl outline-none">{isRegister ? $_("titles.register") : $_("titles.login")}</h2>

          <form on:submit|preventDefault={async () => await auth()}>
            <div class="form-control mb-5 w-full">
              <span class="label label-text">{$_("other.username")}</span>
              <input type="text" bind:value={data.username} class="input-sm input input-bordered w-full rounded" />
            </div>

            <div class="form-control mb-5 w-full">
              <span class="label label-text">{$_("other.password")}</span>
              <input type="password" bind:value={data.password} class="input-sm input input-bordered w-full rounded" />
            </div>

            {#if isRegister}
              <div class="form-control mb-5 w-full">
                <span class="label label-text">{$_("other.accessKey")}</span>
                <input type="text" bind:value={data.accessKey} class="input-sm input input-bordered w-full rounded" />
              </div>

              <div class="form-control mb-5 w-full">
                <span class="label label-text">{$_("other.secretKey")}</span>
                <input
                  type="password"
                  bind:value={data.secretKey}
                  class="input-sm input input-bordered w-full rounded"
                />
              </div>

              <div class="form-control mb-5 w-full">
                <span class="label label-text">{$_("other.s3Bucket")}</span>
                <input type="text" bind:value={data.bucket} class="input-sm input input-bordered w-full rounded" />
              </div>

              <div class="form-control mb-5 w-full">
                <span class="label label-text">{$_("other.s3Endpoint")}</span>
                <input type="text" bind:value={data.endpoint} class="input-sm input input-bordered w-full rounded" />
              </div>

              <div class="form-control mb-5 w-full">
                <span class="label label-text">{$_("other.adminPassword")}</span>
                <input type="password" bind:value={data.admin} class="input-sm input input-bordered w-full rounded" />
              </div>
            {/if}

            {#if error.error}
              <div class="alert alert-error alert-sm mt-5 rounded shadow-lg">
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

            <div class="card-actions mt-5 justify-end">
              <button class="btn btn-outline btn-access btn-sm rounded"
                >{isRegister ? $_("buttons.create") : $_("buttons.enter")}</button
              >

              <button on:click={() => (isRegister = !isRegister)} class="btn btn-outline btn-error btn-sm rounded"
                >{isRegister ? $_("buttons.cancel") : $_("titles.register")}</button
              >
            </div>
          </form>
        </div>
      </div>
    {/if}
  </div>
</div>
