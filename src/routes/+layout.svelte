<script lang="ts">
	import '../app.postcss';
</script>

<main class="static flex min-h-screen flex-col items-center bg-indigo-300">
	<header class="sticky top-0 h-36 w-full overflow-hidden" />
	<section class="relative mt-2 w-[80vw] overflow-hidden rounded-md bg-white p-6 shadow-xl">
		<slot />
	</section>
</main>

<style global>
	header {
		background-image: url('/images/header.webp');
		background-position: center center;
		@apply sticky bg-cover;
	}
	header::before {
		content: '';
		@apply absolute inset-0 bg-gradient-to-b from-transparent to-indigo-300;
	}
	a {
		@apply text-sky-500 hover:cursor-pointer hover:text-sky-600 hover:underline;
	}
</style>
