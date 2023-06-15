<script lang="ts">
	import { slide } from 'svelte/transition';
	export let isOpen = false;
	export let colspan = 1;
	export let trigger: HTMLElement | null = null;

	let rowClass = isOpen ? '' : 'hidden';
	let timeout: NodeJS.Timeout | undefined;
    export const getOpenState = () => isOpen;
	export const toggle = () => {
		isOpen = !isOpen;

		if (isOpen) {
			rowClass = '';
			clearTimeout(timeout);
		} else {
			timeout = setTimeout(() => (rowClass = 'hidden'), 300);
		}
	};

	$: trigger?.addEventListener('click', toggle);
</script>

<tr class={`${rowClass} ${$$restProps.class}`}>
	<td {colspan}>
		{#if isOpen}
			<div transition:slide={{ duration: 300 }}>
				<slot />
			</div>
		{/if}
	</td>
</tr>
