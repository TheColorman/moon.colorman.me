<script lang="ts">
	import Tablelist from '$lib/components/Tablelist.svelte';

	import entries from '$lib/nasuverse/vertices.json';

	let title = '',
		released = '',
		ended = '',
		medium = '';
	function addEntry() {
		entries.push({
			id: entries.length,
			title,
			released,
			ended,
			medium
		});
		// Save json
	}
</script>

<div class="flex flex-col items-center">
	<h1>Add entry</h1>
	<form
		action="/admin?/addVertex"
		method="post"
		enctype="application/x-www-form-urlencoded"
		class="flex gap-4"
	>
		<label>
			<strong>Title</strong>
			<br />
			<input name="title" type="text" />
		</label>

		<label>
			<strong>Released</strong>
			<br />
			<input name="released" type="text" class="w-24" />
		</label>

		<label>
			<strong>Ended</strong>
			<br />
			<input name="ended" type="text" class="w-24" />
		</label>

		<label>
			<strong>Medium</strong>
			<br />
			<input name="medium" type="text" />
		</label>

		<button class="h-8 rounded-xl bg-blue-500 p-1 px-2 text-white" type="submit"> Add </button>
	</form>
	<h1 class="mt-6">Add connection</h1>
	<form
		action="/admin?/addEdge"
		method="post"
		enctype="application/x-www-form-urlencoded"
		class="flex gap-4"
	>
		<label>
			<strong>Source ID</strong>
			<br />
			<input name="source" type="number" class="w-24" />
		</label>

		<label>
			<strong>Target ID</strong>
			<br />
			<input name="target" type="number" class="w-24" />
		</label>

		<label>
			<strong>Type</strong>
			<br />
			<input name="type" type="text"/>
		</label>

		<button class="h-8 rounded-xl bg-blue-500 p-1 px-2 text-white" type="submit"> Add </button>
	</form>
</div>

<div class="mt-6 flex justify-center">
	<Tablelist />
</div>

<style>
	input {
		@apply rounded-md border-2 border-gray-300;
	}
	h1 {
		@apply text-2xl font-bold;
	}
</style>
