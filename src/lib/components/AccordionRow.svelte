<script lang="ts">
	import { slide } from 'svelte/transition';
	export let isOpen = false;
	export let colspan = 1;
	export let trigger: HTMLElement | null = null;

	let rowClass = isOpen ? '' : 'hidden';
	let timeout: NodeJS.Timeout | undefined;
	export const getOpenState = () => isOpen;
	export const open = () => {
		isOpen = true;
		rowClass = '';
		clearTimeout(timeout);
	};
	export const close = () => {
		isOpen = false;
		timeout = setTimeout(() => (rowClass = 'hidden'), 300);
	};
	export const toggle = () => (isOpen ? close() : open());

	$: trigger?.addEventListener('click', toggle);
</script>

<tr class={`${rowClass} ${$$restProps.class}`}>
	<td {colspan}>
		{#if isOpen}
			<div transition:slide|global={{ duration: 300 }}>
				<slot />
			</div>
		{/if}
	</td>
</tr>
