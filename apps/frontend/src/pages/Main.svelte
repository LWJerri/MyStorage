<script lang="ts">
	import { onMount } from "svelte";
	import fileSize from "filesize";
	import { toast } from "@zerodevx/svelte-toast";
	import Navbar from "../components/Navbar.svelte";

	let response = {} as {
		error: boolean;
		uploads: Array<{ id: string; createdAt: Date; name: string; size: number; url: string; key: string }>;
	};

	onMount(async () => {
		const apiRequest = await (await fetch("/api/file", { method: "GET" })).json();

		response = apiRequest;
	});

	async function deleteFile(id: string, name: string) {
		const apiRequest = await fetch("/api/file", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ id }),
		});

		if (apiRequest.status == 302) {
			response.uploads = response.uploads.filter((upload) => upload.id !== id);

			toast.push(`Файл ${name} удалён!`, {
				theme: {
					"--toastBackground": "#48BB78",
					"--toastBarBackground": "#2F855A",
				},
			});
		} else {
			toast.push(`Произошла ошибка при удалении ${name}!`, {
				theme: {
					"--toastBackground": "#F56565",
					"--toastBarBackground": "#C53030",
				},
			});
		}
	}
</script>

<div>
	<Navbar />

	{#if response?.uploads?.length > 0}
		<div class="grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-5">
			{#each response.uploads as upload}
				<div class="card card-compact bg-base-200 shadow-lg rounded">
					<div class="card-body">
						<h2 class="card-title font-bold">{upload.name}</h2>
						<p>
							Загружен: {new Date(upload.createdAt).toLocaleDateString()}
							{new Date(upload.createdAt).toLocaleTimeString()}
						</p>
						<p>Размер: {fileSize(upload.size)}</p>
						<div class="card-actions justify-end mt-5">
							<a href={upload.url} target="_blank" class="btn btn-sm btn-outline btn-accent rounded w-full">Открыть</a>
							<button
								on:click={async () => await deleteFile(upload.id, upload.name)}
								class="btn btn-sm btn-outline btn-error rounded w-full">Удалить</button
							>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else if response.error}
		<div class="alert alert-error shadow-lg">
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
				<span>Произошла ошибка при загрузке файлов!</span>
			</div>
		</div>
	{:else}
		<div class="alert alert-warning rounded">
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
				<span class="select-none">Список загруженных файлов пуст!</span>
			</div>
		</div>
	{/if}
</div>
