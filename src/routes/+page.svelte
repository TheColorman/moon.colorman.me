<script lang="ts">
	import Tablelist from '$lib/components/Tablelist.svelte';
</script>

<div class="ml-8 mt-2 flex">
	<div>
		<h1 class="text-2xl">All Nasuverse works, in release order</h1>
		<h2 class="text-xl text-gray-500">(Not all works are currently present)</h2>
		<br />
		<p class="max-w-md">
			This page consists of a table of all Nasuverse works. You can sort the table by clicking on
			the column headers, and mark rows as complete by clicking on the checkbox. The table is saved
			to your browser's local storage, so you can come back to it later.
		</p>
		<p class="ml-2 mt-2 text-sm text-gray-500">Tip: Ctrl+click on a link to toggle open all rows.</p>
	</div>
	<img
		src="/images/clueless.png"
		alt="hmm today i will download the entirety of the nasuverse series and freely distribute it diregarding any and all copyright law. *clueless*"
		class="h-60 w-60"
	/>
	<a
		href="https://thecolorman.github.io/Fate-Timeline/"
		target="_blank"
		rel="noopener noreferrer"
		class="relative ml-16 flex h-52 w-52 items-center justify-center bg-gray-300 text-gray-800 transition-all hover:bg-gray-500 hover:text-white"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="h-14 w-14"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
			/>
		</svg>
		<p class="absolute bottom-1 self-center text-center">View the Nasuverse timeline</p>
	</a>
</div>
<div class="flex justify-center">
	<Tablelist />
</div>
