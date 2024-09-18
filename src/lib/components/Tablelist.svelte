<script lang="ts">
	import type { EntriesMetadata } from '$lib/types';
	import {
		format,
		translationNone,
		translationPartly,
		missingMaterial,
		unofficial
	} from '$lib/svg';
	import AccordionRow from './AccordionRow.svelte';
	import entriesImmutable from '$lib/nasuverse/vertices.json';
	import metadataImmuatable from '$lib/nasuverse/metadata.json';
	import completed from '$lib/completed';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Switch from '$lib/components/Switch.svelte';
	import { iconMap } from '$lib/maps';
	import { objectEntries } from '$lib/utils';

	// Track whether to show unofficial entries
	let showUnofficial = 'on';

	// Copy entries to a new array so we can sort it
	let entries = [...entriesImmutable];
	const metadata = metadataImmuatable as EntriesMetadata;

	// Toggle checkbox and save to local storage
	function toggleRow(id: number) {
		// Check if row or checkbox itseslf was clicked
		completed.update((completed) => {
			completed[id] = !completed[id];
			return completed;
		});
	}

	// Sorting
	type SortKey = 'id' | 'completed' | 'title' | 'released' | 'ended' | 'medium';

	const currentSort: {
		primary: {
			key: SortKey;
			ascending: boolean;
		};
		secondary: {
			key: SortKey;
			ascending: boolean;
		};
	} = {
		primary: {
			key: 'released',
			ascending: true
		},
		secondary: {
			key: 'id',
			ascending: true
		}
	};
	function sortEntries(sort: SortKey) {
		// Move primary sort to secondary if primary is new
		const newPrimary = currentSort.primary.key !== sort;
		if (newPrimary) {
			currentSort.secondary = currentSort.primary;
		}
		// Reverse sort order if primary sort is clicked again
		currentSort.primary = {
			key: sort,
			ascending: newPrimary ? true : !currentSort.primary.ascending
		};

		// Sorting functions. If the same, return 0 so secondary sort can be applied
		const sortFuncs = {
			id: (a: (typeof entries)[0], b: (typeof entries)[0]) => a.id - b.id,
			completed: (a: (typeof entries)[0], b: (typeof entries)[0]) => {
				const aCompleted = $completed[a.id];
				const bCompleted = $completed[b.id];
				if (aCompleted === bCompleted) {
					return 0;
				}
				return aCompleted ? -1 : 1;
			},
			title: (a: (typeof entries)[0], b: (typeof entries)[0]) => a.title.localeCompare(b.title),
			released: (a: (typeof entries)[0], b: (typeof entries)[0]) => {
				const aString = a.released === 'TBA' ? '9999-12-31' : a.released;
				const bString = b.released === 'TBA' ? '9999-12-31' : b.released;
				const aDate = new Date(aString);
				const bDate = new Date(bString);
				if (aDate === bDate) {
					return 0;
				}
				return aDate > bDate ? 1 : -1;
			},
			ended: (a: (typeof entries)[0], b: (typeof entries)[0]) => {
				if (a.ended === '') {
					return 1;
				}
				if (b.ended === '') {
					return -1;
				}
				const aString = a.ended === 'Ongoing' ? '9999-12-31' : a.ended;
				const bString = b.ended === 'Ongoing' ? '9999-12-31' : b.ended;
				const aDate = new Date(aString);
				const bDate = new Date(bString);
				if (aDate === bDate) {
					return 0;
				}
				return aDate > bDate ? 1 : -1;
			},
			medium: (a: (typeof entries)[0], b: (typeof entries)[0]) => a.medium.localeCompare(b.medium)
		};

		// Sort entries
		entries = entries.sort((a, b) => {
			const aVal = sortFuncs[currentSort.primary.key](a, b);
			if (aVal === 0) {
				return sortFuncs[currentSort.secondary.key](a, b);
			}
			return currentSort.primary.ascending ? aVal : -aVal;
		});
	}

	// Get class for sorting arrows
	$: sortKeys = [currentSort.primary.key, currentSort.secondary.key];
	$: sortList = {
		id: sortKeys.includes('id')
			? currentSort.primary.key === 'id'
				? currentSort.primary.ascending
					? 'asc'
					: 'desc'
				: currentSort.secondary.ascending
				? 'asc'
				: 'desc'
			: false,
		completed: sortKeys.includes('completed')
			? currentSort.primary.key === 'completed'
				? currentSort.primary.ascending
					? 'asc'
					: 'desc'
				: currentSort.secondary.ascending
				? 'asc'
				: 'desc'
			: false,
		title: sortKeys.includes('title')
			? currentSort.primary.key === 'title'
				? currentSort.primary.ascending
					? 'asc'
					: 'desc'
				: currentSort.secondary.ascending
				? 'asc'
				: 'desc'
			: false,
		released: sortKeys.includes('released')
			? currentSort.primary.key === 'released'
				? currentSort.primary.ascending
					? 'asc'
					: 'desc'
				: currentSort.secondary.ascending
				? 'asc'
				: 'desc'
			: false,
		ended: sortKeys.includes('ended')
			? currentSort.primary.key === 'ended'
				? currentSort.primary.ascending
					? 'asc'
					: 'desc'
				: currentSort.secondary.ascending
				? 'asc'
				: 'desc'
			: false,
		medium: sortKeys.includes('medium')
			? currentSort.primary.key === 'medium'
				? currentSort.primary.ascending
					? 'asc'
					: 'desc'
				: currentSort.secondary.ascending
				? 'asc'
				: 'desc'
			: false
	};

	// Others
	const columnLabels: Array<{
		key: SortKey;
		label: string;
		width: string;
	}> = [
		{
			key: 'completed',
			label: '',
			width: '0.914'
		},
		{
			key: 'title',
			label: 'Title',
			width: '36.44'
		},
		{
			key: 'released',
			label: 'Released',
			width: '6.704'
		},
		{
			key: 'ended',
			label: 'Ended',
			width: '5.858'
		},
		{
			key: 'medium',
			label: 'Medium',
			width: '8.456'
		}
	];
	const accordionLinks = Object.fromEntries(
		entries.map((entry) => [entry.id, null as HTMLElement | null])
	);
	const accordionRefs = Object.fromEntries(
		entries.map((entry) => [entry.id, null as AccordionRow | null])
	);
	/**
	 * Expand all accordions when ctrl+clicking on one
	 */
	function expandAll(
		event: {
			preventDefault: () => void;
			ctrlKey: boolean;
		},
		targetId: number
	) {
		if (!event.ctrlKey) {
			return;
		}
		event.preventDefault();
		const targetState = accordionRefs[targetId]?.getOpenState() ? false : true;
		Object.entries(accordionRefs).forEach(([id, accordion]) => {
			if (id === targetId.toString()) {
				return;
			}
			if (accordion?.getOpenState() !== targetState) {
				accordion?.toggle();
			}
		});
	}
	/**
	 * Preload cover images when hovering over accordion
	 */
	function preload(image: string | null) {
		if (!image) {
			return;
		}
		const img = new Image();
		img.src = image;
	}

	/**
	 * Get info on an entry from its id
	 */
	function getEntry(id: number | string) {
		if (typeof id === 'string') {
			id = parseInt(id);
		}
		const entry = entries.find((entry) => entry.id === id);
		return entry;
	}
	$: entry = getEntry($page.params.slug);
	const baseMeta = `<meta name="title" content="Entirety of Nasuverse, by Colorman" />
                      <title>All Nasuverse works, in release order</title>
                      <meta
                          name="description"
                          content="Read, watch, play and track your progress in everything from the Nasuverse, for free"
                      />
                      <!-- Open Graph / Facebook -->
                      <meta property="og:type" content="website" />
                      <meta property="og:url" content="https://moon.colorman.me/" />
                      <meta property="og:title" content="Entirety of Nasuverse, by Colorman" />
                      <meta
                          property="og:description"
                          content="Read, watch, play and track your progress in everything from the Nasuverse, for free"
                      />
                      <meta property="og:image" content="https://moon.colorman.me/images/header.webp" />
                      <!-- Twitter -->
                      <meta property="twitter:card" content="summary_large_image" />
                      <meta property="twitter:url" content="https://moon.colorman.me/" />
                      <meta property="twitter:title" content="Entirety of Nasuverse, by Colorman" />
                      <meta
                          property="twitter:description"
                          content="Read, watch, play and track your progress in everything from the Nasuverse, for free"
                      />
                      <meta property="twitter:image" content="https://moon.colorman.me/images/header.webp" />`;

	// Open accordion if url contains permalink to entry
	onMount(() => {
		if (window.location.hash) {
			const id = window.location.hash.slice(1);
			const target = accordionRefs[id];

			if (target?.getOpenState() === false) {
				setTimeout(() => {
					target?.toggle();
				}, 300);
			}
		}
	});

	function getConsumeKeyword(medium: string) {
		switch (medium) {
			case 'Web Novel':
			case 'Short Story':
			case 'Manga':
			case 'Light Novel':
			case 'Novel':
			case 'Material Book':
				return 'Read';
			case 'Drama CD':
			case 'OVA':
			case 'Anime':
			case 'Anime Film':
			case 'ONA Series':
			case 'Anime Special':
				return 'Watch';
			case 'Visual Novel':
			case 'Video Game':
			case 'April Fools Story':
			case 'Mobile Game':
			case 'Arcade Game':
			default:
				return 'Download';
		}
	}

	function displayNote(note: string) {
		if (!note) return;

		switch (note) {
			case 'format':
				return format;
			case 'translation-none':
				return translationNone;
			case 'translation-partly':
				return translationPartly;
			case 'missing-material':
				return missingMaterial;
			case 'unofficial':
				return unofficial;
			default:
				return '';
		}
	}
</script>

<!-- Set head if url contains permalink to entry -->
<svelte:head>
	{#if entry && metadata[entry.id]}
		{@html `<!-- Dynamic head meta -->
            <title>${getConsumeKeyword(entry.medium)} ${entry.title}</title>
			<meta name="title" content="Download ${entry.title}" />
			<meta property="og:url" content="https://moon.colorman.me/${entry.id}#${entry.id}" />
			<meta property="og:title" content="Download ${entry.title}" />
			<meta property="twitter:card" content="summary_large_image" />
			<meta property="twitter:url" content="https://moon.colorman.me/${entry.id}#${entry.id}" />
			<meta property="twitter:title" content="Download ${entry.title}" />
			<meta name="description" content="${metadata[entry.id].description}" />
			<meta property="og:description" content="${metadata[entry.id].description}" />
            <meta property="twitter:description" content="${metadata[entry.id].description}" />
			<meta property="og:image" content="https://moon.colorman.me/images/items/${
				metadata[entry.id].cover
			}" />
			<meta property="twitter:image" content="https://moon.colorman.me/images/items/${
				metadata[entry.id].cover
			}" />`}
	{:else}
		{@html baseMeta}
	{/if}
</svelte:head>

<div class="mt-8">
	<Switch
		bind:value={showUnofficial}
		label="Show unofficial entries"
		fontSize={16}
		design="slider"
	/>
	<table class="mt-4 w-full">
		{#each columnLabels as { key, label, width }}
			<th
				class="hidden md:table-cell"
				on:click={() => sortEntries(key)}
				style={`width: ${width}rem`}
			>
				{label}
				<div class="relative -ml-0.5 mb-2 mr-2 inline-block">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="absolute -top-1 h-3 w-3 {sortList[key] === 'desc' ? 'block' : 'hidden'}"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
					</svg>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="absolute -top-1 h-3 w-3 {sortList[key] === 'asc' ? 'block' : 'hidden'}"
					>
						<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
					</svg>
				</div>
			</th>
		{/each}
		{#each entries as entry, i}
			{#if !entry.notes?.includes('unofficial') || showUnofficial == 'on'}
				<tr
					class="group border-t dark:border-[#2e3c52] {$completed[entry.id]
						? 'bg-gray-200 text-gray-500 hover:bg-gray-300 dark:bg-[#293548] dark:text-gray-400 dark:hover:bg-[#2e3c52]'
						: 'hover:bg-gray-100 dark:hover:bg-[#293548]'}"
					id={`${entry.id}`}
				>
					<td class="hidden py-1 md:table-cell">
						<input
							type="checkbox"
							class="hover:cursor-pointer"
							bind:checked={$completed[entry.id]}
							on:click={() => toggleRow(entry.id)}
						/>
					</td>
					<td class="relative">
						{#if metadata[entry.id]}
							<button
								class="link border-0 p-0"
								bind:this={accordionLinks[entry.id]}
								on:click|stopPropagation={(event) => expandAll(event, entry.id)}
								on:mouseover={() =>
									metadata[entry.id].cover && preload(`/images/items/${metadata[entry.id].cover}`)}
								on:focus={() =>
									metadata[entry.id].cover && preload(`/images/items/${metadata[entry.id].cover}`)}
							>
								<p class="w-full text-start">
									{entry.title}
								</p>
							</button>
							<a
								class="hidden hover:cursor-pointer hover:!text-gray-700 group-hover:inline-block group-hover:text-gray-400 dark:hover:!text-gray-300 dark:group-hover:text-gray-600"
								title="Copy permalink"
								href="/{entry.id}#{entry.id}"
								on:click|stopPropagation|preventDefault={(event) => {
									goto(`${entry.id}/#${entry.id}`);
									navigator.clipboard.writeText(`https://moon.colorman.me/${entry.id}#${entry.id}`);
								}}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="h-4 w-4 translate-y-0.5"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
									/>
								</svg>
							</a>
							<div class="hidden md:inline">
								{#if entry.notes !== undefined}
									{#each entry.notes as note}
										<span class="float-right">
											{@html displayNote(note)}
										</span>
									{/each}
								{/if}
							</div>

							<div class="ml-2 md:hidden">
								<p class="text-sm text-slate-400">
									{entry.released}{entry.ended ? ` - ${entry.ended}` : ''}
								</p>
								<div class="flex justify-between">
									<p class="font-light">
										{entry.medium}
									</p>
									<div class="md:hidden">
										{#if entry.notes !== undefined}
											{#each entry.notes as note}
												<span>
													{@html displayNote(note)}
												</span>
											{/each}
										{/if}
									</div>
								</div>
							</div>
						{:else}
							<p class="inline-block">{entry.title}</p>
							<a
								href="/#{entry.id}"
								class="hidden hover:cursor-pointer hover:!text-gray-700 group-hover:inline-block group-hover:text-gray-400 dark:hover:!text-gray-300 dark:group-hover:text-gray-600"
								title="Copy permalink"
								on:click|stopPropagation|preventDefault={() => {
									goto(`/#${entry.id}`);
									navigator.clipboard.writeText(`https://moon.colorman.me/#${entry.id}`);
								}}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke-width="1.5"
									stroke="currentColor"
									class="h-4 w-4 translate-y-0.5"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
									/>
								</svg>
							</a>
						{/if}
					</td>
					<td class="hidden md:table-cell">{entry.released}</td>
					<td class="hidden md:table-cell">{entry.ended}</td>
					<td class="hidden md:table-cell">{entry.medium}</td>
				</tr>

				{#if metadata[entry.id]}
					<AccordionRow
						colspan={columnLabels.length}
						trigger={accordionLinks[entry.id]}
						class={`border-t bg-gray-100 dark:border-[#35445c] dark:bg-[#293548] dark:text-gray-200`}
						bind:this={accordionRefs[entry.id]}
					>
						<div class="block p-2 md:m-2 md:mx-3 md:grid md:grid-cols-auto-fr md:p-0">
							{#if metadata[entry.id].cover}
								<img
									src={`/images/items/${metadata[entry.id].cover}`}
									alt={`${entry.title} cover`}
									class="mt-2 w-full max-w-full rounded-md md:mr-4 md:inline md:w-44"
								/>
							{/if}

							<div class="auto-rows-min md:relative md:grid md:grid-cols-3 md:gap-4">
								<div class="absolute right-1 top-1 hidden gap-2 md:flex">
									{#each objectEntries(metadata[entry.id].external ?? {}) as [site, link]}
										<a
											class="my-0.5 md:m-0"
											href={link}
											target="_blank"
											rel="noopener noreferrer"
											title={iconMap[site].description}
										>
											<img
												src="/images/{iconMap[site].icon}"
												alt={iconMap[site].title}
												class="w-4"
											/>
										</a>
									{/each}
								</div>

								<button
									class="mb-2 flex w-full items-center justify-center text-white md:hidden"
									on:click={() => toggleRow(entry.id)}
								>
									<input
										type="checkbox"
										class="hover:cursor-pointer"
										bind:checked={$completed[entry.id]}
									/>
									<span class="ml-2">
										{$completed[entry.id] ? 'Marked as done' : 'Mark as done'}
									</span>
								</button>
								<div class="mb-8 flex md:col-span-2 md:m-0 md:block">
									<p class="w-[92%] whitespace-pre-line md:w-full">
										{@html metadata[entry.id].description || 'No description available.'}
									</p>
									<div class="mt-1 flex w-[8%] flex-col items-center md:hidden">
										{#each objectEntries(metadata[entry.id].external ?? {}) as [site, link]}
											<a
												class="my-0.5 rounded"
												href={link}
												target="_blank"
												rel="noopener noreferrer"
												title={iconMap[site].description}
											>
												<img
													src="/images/{iconMap[site].icon}"
													alt={iconMap[site].title}
													class="w-4"
												/>
											</a>
										{/each}
									</div>
								</div>

								<!-- Official links -->
								<div class="row-span-2">
									<h1 class="mt-6 text-xl font-thin">Official links</h1>
									<ul>
										{#if Object.keys(metadata[entry.id].official).length}
											{#each Object.entries(metadata[entry.id].official) as [key, value]}
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
										{#if Object.keys(metadata[entry.id].download).length}
											{#each Object.entries(metadata[entry.id].download) as [key, value]}
												<li>
													{#if value.startsWith('#')}
														<a
															href={value}
															on:click={(event) => {
																const target = accordionRefs[value.slice(1)];
																console.log(target?.getOpenState());
																if (!target?.getOpenState()) {
																	target?.toggle();
																}
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
									{#if Object.keys(metadata[entry.id].source).length}
										<h2 class="mt-4 text-base font-light">Download source</h2>
										<ul>
											{#each Object.entries(metadata[entry.id].source) as [key, value]}
												<li>
													<a href={value} target="_blank" rel="noopener noreferrer">{key}</a>
												</li>
											{/each}
										</ul>
									{/if}
									{#if metadata[entry.id].credit}
										<h2 class="mt-2 text-base font-light">Download credit:</h2>
										<p class="whitespace-pre-line">
											{@html metadata[entry.id].credit}
										</p>
									{/if}
								</div>
							</div>
						</div>
					</AccordionRow>
				{/if}
			{/if}
		{/each}
	</table>
</div>

<style>
	th {
		@apply p-2 hover:cursor-pointer;
	}
	td {
		@apply px-2;
	}
</style>
