<script lang="ts">
	import '../app.css';

	const tabs = {
		0: 'Progress',
		1: 'Timeline',
		2: 'Settings'
	};
	const selected = 2;
</script>

<main
	class="flex min-h-screen w-screen flex-col items-center bg-gradient-to-tr from-blue-400 to-indigo-400 bg-fixed dark:bg-[#0e0031] dark:text-white"
>
	<div class="w-full max-w-[70rem]">
		<nav class="mt-6 flex justify-start">
			<ul
				class="relative flex rounded-t-xl bg-white/90 before:absolute before:top-0 before:left-0 before:h-1/3 before:w-full before:bg-gray-200 before:rounded-t-xl"
			>
				{#each Object.values(tabs) as tab, i}
					<li
						class={`relative box-border rounded-t-xl border-gray-400 py-2 px-2 before:absolute before:left-0 before:top-0 before:z-10 before:box-border before:h-1/2 before:w-full before:rounded-t-xl before:border-b-0 before:border-gray-400 after:absolute after:left-0 after:bottom-0 after:z-10 after:box-border after:h-1/2 after:w-full after:rounded-b-xl after:border-gray-400 ${
							i !== selected ? 'bg-gray-200' : ''
						}`}
						class:before:border-2={i === selected}
						class:before:border-l-0={i === 0}
						class:before:border-r-0={i === Object.values(tabs).length - 1}
						class:after:border-l-2={i === selected + 1}
						class:after:border-r-2={i === selected - 1}
						class:border-b-2={i !== selected}
						class:border-l-2={i === selected && i === 0}
						class:border-r-2={i === selected && i === Object.values(tabs).length - 1}
						class:rounded-br-xl={i === selected - 1}
						class:rounded-bl-xl={i === selected + 1}
						class:pl-[10px]={i === 0 && i !== selected}
						class:pr-[6px]={i === Object.values(tabs).length - 1 && i !== selected}
						class:-mr-1={i === Object.values(tabs).length - 1}
						style={`left: -${i * 2}px`}
					>
						{tab}
					</li>
				{/each}
			</ul>
		</nav>
		<section class="mb-12 min-h-[89vh] rounded-xl rounded-tl-none bg-white/90 p-6">
			<slot />
		</section>
	</div>
</main>
