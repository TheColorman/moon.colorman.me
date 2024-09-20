<script lang="ts">
	import completed from '$lib/completed';
	import { iconMap } from '$lib/maps';
	import type { EntryData, EntryMetadata } from '$lib/types';
	import { objectEntries } from '$lib/utils';

	export let metadata: EntryMetadata;
	export let entry: EntryData;
	export let toggleRow: (arg0: number) => void;
	export let openRow: (arg0: number) => void;
</script>

<div class="block p-2 md:m-2 md:mx-3 md:grid md:grid-cols-auto-fr md:p-0">
	{#if metadata.cover}
		<img
			src={`/images/items/${metadata.cover}`}
			alt={`${entry.title} cover`}
			class="mt-2 w-full max-w-full rounded-md md:mr-4 md:inline md:w-44"
		/>
	{/if}

	<div class="auto-rows-min md:relative md:grid md:grid-cols-3 md:gap-4">
		<div class="absolute right-1 top-1 hidden gap-2 md:flex">
			{#each objectEntries(metadata.external ?? {}) as [site, link]}
				<a
					class="my-0.5 md:m-0"
					href={link}
					target="_blank"
					rel="noopener noreferrer"
					title={iconMap[site].description}
				>
					<img src="/images/{iconMap[site].icon}" alt={iconMap[site].title} class="w-4" />
				</a>
			{/each}
		</div>

		<button
			class="mb-2 flex w-full items-center justify-center text-white md:hidden"
			on:click={() => toggleRow(entry.id)}
		>
			<input type="checkbox" class="hover:cursor-pointer" bind:checked={$completed[entry.id]} />
			<span class="ml-2">
				{$completed[entry.id] ? 'Marked as done' : 'Mark as done'}
			</span>
		</button>
		<div class="mb-8 flex md:col-span-2 md:m-0 md:block">
			<p class="w-[92%] whitespace-pre-line md:w-full">
				{@html metadata.description || 'No description available.'}
			</p>
			<div class="mt-1 flex w-[8%] flex-col items-center md:hidden">
				{#each objectEntries(metadata.external ?? {}) as [site, link]}
					<a
						class="my-0.5 rounded"
						href={link}
						target="_blank"
						rel="noopener noreferrer"
						title={iconMap[site].description}
					>
						<img src="/images/{iconMap[site].icon}" alt={iconMap[site].title} class="w-4" />
					</a>
				{/each}
			</div>
		</div>

		<!-- Official links -->
		<div class="row-span-2">
			<h1 class="mt-6 text-xl font-thin">Official links</h1>
			<ul>
				{#if Object.keys(metadata.official).length}
					{#each Object.entries(metadata.official) as [key, value]}
						<li>
							<a href={value} target="_blank" rel="noopener noreferrer">{key}</a>
						</li>
					{/each}
				{:else}
					<li>Nothing here!</li>
				{/if}
			</ul>

			<!-- Downloads -->
			<h1 class="mt-3 text-xl font-thin">Downloads</h1>
			<ul>
				{#if Object.keys(metadata.download).length}
					{#each Object.entries(metadata.download) as [key, value]}
						<li>
							{#if value.includes('#')}
								<a
									href={value}
									on:click={() => {
										openRow(parseInt(value.split('#')[1]));
									}}>{key}</a
								>
							{:else}
								<a href={value} target="_blank" rel="noopener noreferrer">{key}</a>
							{/if}
						</li>
					{/each}
				{:else}
					<li>Nothing here!</li>
				{/if}
			</ul>
		</div>

		<div class="col-span-2 row-start-2">
			{#if Object.keys(metadata.source).length}
				<h2 class="mt-4 text-base font-light">Download source</h2>
				<ul>
					{#each Object.entries(metadata.source) as [key, value]}
						<li>
							<a href={value} target="_blank" rel="noopener noreferrer">{key}</a>
						</li>
					{/each}
				</ul>
			{/if}
			{#if metadata.credit}
				<h2 class="mt-2 text-base font-light">Download credit:</h2>
				<p class="whitespace-pre-line">
					{@html metadata.credit}
				</p>
			{/if}
		</div>
	</div>
</div>
