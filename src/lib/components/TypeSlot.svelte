<script lang="ts">
	import { unofficial } from '$lib/svg';
	import type { ObjectOption } from 'svelte-multiselect';

	export let option: ObjectOption;
	export let gap = `5pt`;
</script>

<span style:gap>
	{#if option.value == 'unofficial'}
		{@html unofficial}
	{/if}
	{option.label}
</span>

<style>
	span {
		display: flex;
	}
</style>
