<script lang="ts">
	import type { EntriesMetadata } from '$lib/types';
	import AccordionRow from './AccordionRow.svelte';
	import entriesImmutable from '$lib/nasuverse/vertices.json';
	import metadataImmuatable from '$lib/nasuverse/metadata.json';
	import completed from '$lib/completed';

	// Copy entries to a new array so we can sort it
	let entries = [...entriesImmutable];
	const metadata = metadataImmuatable as EntriesMetadata;

	// Toggle checkbox and save to local storage
	function toggleRow(
		event: MouseEvent & { currentTarget: EventTarget & (HTMLTableRowElement | HTMLInputElement) },
		id: number
	) {
		// Check if row or checkbox itseslf was clicked
		const checkbox =
			event.currentTarget instanceof HTMLTableRowElement
				? (event.currentTarget.querySelector('input[type="checkbox"]') as HTMLInputElement)
				: event.currentTarget;

		checkbox.checked = !checkbox.checked;
		completed.update((completed) => {
			completed[id] = checkbox.checked;
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
	}> = [
		{
			key: 'completed',
			label: ''
		},
		{
			key: 'title',
			label: 'Title'
		},
		{
			key: 'released',
			label: 'Released'
		},
		{
			key: 'ended',
			label: 'Ended'
		},
		{
			key: 'medium',
			label: 'Medium'
		}
	];
	const accordionRefs = new Array().fill(null, 0, entries.length);
</script>

<table>
	<tr class="text-left hover:bg-gray-100">
		{#each columnLabels as { key, label }}
			<th on:click={() => sortEntries(key)}>
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
	</tr>
	{#each entries as entry, i}
		<tr
			class="border-t {$completed[entry.id]
				? 'bg-gray-200 text-gray-500 hover:bg-gray-300'
				: 'hover:bg-gray-100'}"
			on:click={(event) => toggleRow(event, entry.id)}
			id={`${entry.id}`}
		>
			<td class="py-1">
				<input
					type="checkbox"
					class="hover:cursor-pointer"
					bind:checked={$completed[entry.id]}
					on:click={(event) => toggleRow(event, entry.id)}
				/>
			</td>
			<td>
				<!-- svelte-ignore a11y-missing-attribute a11y-click-events-have-key-events -->
				<a bind:this={accordionRefs[i]} on:click|stopPropagation>{entry.title}</a></td
			>
			<td>{entry.released}</td>
			<td>{entry.ended}</td>
			<td>{entry.medium}</td>
		</tr>
		{#if metadata[entry.id]}
			<AccordionRow
				colspan={columnLabels.length + 1}
				trigger={accordionRefs[i]}
				class={`border-t ${$completed[entry.id] ? 'bg-gray-100' : 'bg-gray-100'}`}
				isOpen={true}
			>
				{#if metadata[entry.id].cover}
					<img src={`/images/items/${metadata[entry.id].cover}`} alt="Kara no Kyoukai cover" />
				{/if}
				<div class="m-1 mx-2 columns-2">
					<div>
						<h1 class="text-xl font-thin">Official links</h1>
						<ul>
							{#if metadata[entry.id].official === undefined}
								<li>Nothing here!</li>
							{:else}
								{#each Object.entries(metadata[entry.id].official) as [key, value]}
									<li>
										<a href={value} target="_blank" rel="noopener noreferrer">{key}</a>
									</li>
								{/each}
							{/if}
						</ul>
					</div>
					<div>
						<h1 class="text-xl font-thin">Downloads</h1>
					</div>
				</div>
			</AccordionRow>
		{/if}
	{/each}
</table>

<style>
	th {
		@apply p-2 hover:cursor-pointer;
	}
	td {
		@apply px-2;
	}

	a {
		@apply text-sky-500 hover:cursor-pointer hover:text-sky-600 hover:underline;
	}
</style>
