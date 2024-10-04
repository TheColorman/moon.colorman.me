<script lang="ts">
	import { goto } from '$app/navigation';
	import completed from '$lib/completed';
	import {
		format,
		missingMaterial,
		translationNone,
		translationPartly,
		unofficial
	} from '$lib/svg';
	import type { EntryData, EntryMetadata } from '$lib/types';
	import { preload } from '$lib/utils';
	import AccordionRow from './AccordionRow.svelte';
	import Entry from './Entry.svelte';

	export let entry: EntryData;
	export let metadata: EntryMetadata | undefined = undefined;
	export let toggleRow: (arg0: number) => void;
	export let openRow: (arg0: number) => void;
	export let accordionLinks: {
		[k: EntryData['id']]: HTMLElement | null;
	};
	export let accordionRefs: {
		[k: EntryData['id']]: AccordionRow | null;
	};
	export let columnLabels: readonly object[];

	/**
	 * Expand all accordions when ctrl+clicking on one
	 */
	function toggleAll(event: { ctrlKey: boolean }, targetId: number) {
		if (!event.ctrlKey) return;

		const targetState = accordionRefs[targetId]?.getOpenState() ? false : true;
		Object.entries(accordionRefs).forEach(([id, accordion]) => {
			if (id == targetId.toString()) return;
			if (accordion?.getOpenState() !== targetState) accordion?.toggle();
		});
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

<tr
	class="group border-t dark:border-dark-divider {$completed[entry.id]
		? 'bg-offset-primary text-gray-500 hover:bg-hover-primary dark:bg-dark-offset-primary dark:text-gray-400 dark:hover:bg-dark-hover-primary'
		: 'hover:bg-primary dark:hover:bg-dark-primary'}"
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
		{#if metadata}
			<button
				class="link border-0 p-0"
				bind:this={accordionLinks[entry.id]}
				on:click|stopPropagation={(event) => toggleAll(event, entry.id)}
				on:mouseover={() => metadata.cover && preload(`/images/items/${metadata.cover}`)}
				on:focus={() => metadata.cover && preload(`/images/items/${metadata.cover}`)}
			>
				<p class="w-full text-start">
					{entry.title}
				</p>
			</button>
			<a
				class="md:hidden inline-block hover:cursor-pointer hover:!text-gray-700 group-hover:inline-block group-hover:text-gray-400 dark:hover:!text-gray-300 dark:group-hover:text-gray-600"
				title="Copy permalink"
				href="/{entry.id}#{entry.id}"
				on:click|stopPropagation|preventDefault={() => {
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
		{:else}
			<span class="inline-block">{entry.title}</span>
			<a
				href="/#{entry.id}"
				class="inline-block md:hidden hover:cursor-pointer hover:!text-gray-700 group-hover:inline-block group-hover:text-gray-400 dark:hover:!text-gray-300 dark:group-hover:text-gray-600"
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
	</td>
	<td class="hidden md:table-cell">{entry.released}</td>
	<td class="hidden md:table-cell">{entry.ended}</td>
	<td class="hidden md:table-cell">{entry.medium}</td>
</tr>

{#if metadata}
	<AccordionRow
		colspan={columnLabels.length}
		trigger={accordionLinks[entry.id]}
		class={`border-t bg-primary dark:border-[#35445c] dark:bg-dark-primary dark:text-gray-200`}
		bind:this={accordionRefs[entry.id]}
	>
		<Entry {metadata} {entry} {openRow} {toggleRow} />
	</AccordionRow>
{/if}

<style>
	td {
		@apply px-2;
	}
</style>
