<script lang="ts">
	import { page } from '$app/stores';
	import completed from '$lib/completed';
	import activeFilters from '$lib/filter';
	import metadataImmuatable from '$lib/nasuverse/metadata.json';
	import entriesImmutable from '$lib/nasuverse/vertices.json';
	import type { EntriesMetadata, EntryData, SortKey } from '$lib/types';
	import { onMount } from 'svelte';
	import AccordionRow from './AccordionRow.svelte';
	import Row from './Row.svelte';

	let className: string = '';
	export { className as class };

	// Copy entries to a new array so we can sort it
	let entries = [...entriesImmutable] as EntryData[];
	activeFilters.subscribe((v) => {
		entries = [...entriesImmutable].filter((e) =>
			v.map((f) => f.value).includes(e.type)
		) as EntryData[];
	});
	const metadata = metadataImmuatable as EntriesMetadata;

	// Toggle checkbox and save to local storage
	function toggleRow(id: number) {
		// Check if row or checkbox itseslf was clicked
		completed.update((completed) => {
			completed[id] = !completed[id];
			return completed;
		});
	}

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
	const columnLabels = [
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
	] as const;
	const accordionLinks = Object.fromEntries(
		entries.map((entry) => [entry.id, null as HTMLElement | null])
	);
	const accordionRefs = Object.fromEntries(
		entries.map((entry) => [entry.id, null as AccordionRow | null])
	);

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

<table class={className + ' w-full'}>
	<thead>
		<tr>
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
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M19.5 8.25l-7.5 7.5-7.5-7.5"
							/>
						</svg>
					</div>
				</th>
			{/each}
		</tr>
	</thead>
	<tbody />
	{#each entries as entry, i}
		<Row
			{accordionLinks}
			{accordionRefs}
			{toggleRow}
			{columnLabels}
			{entry}
			metadata={metadata[entry.id]}
		/>
	{/each}
	{#if entries.length == 0}
		<tr>
			<td colspan={columnLabels.length}>
				<div
					class="flex h-16 w-full flex-col items-center justify-center text-gray-500 dark:text-gray-400"
				>
					<span>Nothing to show! Update the filter to show entries.</span>
					<span>
						{[
							'(￣ω￣;)',
							'σ(￣、￣〃)',
							'(￣～￣;)',
							'(-_-;)・・・',
							"┐('～`;)┌",
							'(・_・ヾ',
							'(〃￣ω￣〃ゞ',
							'┐(￣ヘ￣;)┌',
							'(・_・;)',
							'(￣_￣)・・・',
							'╮(￣ω￣;)╭',
							'(¯ . ¯;)',
							'(＠_＠)',
							'(・・;)ゞ',
							'Σ(￣。￣ﾉ)',
							'(・・ ) ?',
							'(•ิ_•ิ)?',
							'(◎ ◎)ゞ',
							'(ーー;)',
							'ლ(ಠ_ಠ ლ)',
							'ლ(¯ロ¯"ლ)',
							'(¯ . ¯٥)',
							'(¯ ¯٥)'
						][Math.floor(Math.random() * 23)]}
					</span>
				</div>
			</td>
		</tr>
	{/if}
</table>

<style>
	th {
		@apply p-2 hover:cursor-pointer;
	}
</style>
