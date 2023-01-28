<script lang="ts">
	import '../app.postcss';
</script>

<main class="static flex min-h-screen flex-col items-center bg-indigo-300">
	<header class="sticky h-36 w-full overflow-hidden top-0" />
	<section class="relative mt-2 w-[80vw] rounded-md bg-white p-6 overflow-hidden shadow-xl">
		<slot />
	</section>
</main>

<style>
	header {
		background-image: url('/images/header.webp');
		background-position: center center;
		@apply sticky bg-cover;
	}
	header::before {
		content: '';
		@apply absolute inset-0 bg-gradient-to-b from-transparent to-indigo-300;
	}
</style>
