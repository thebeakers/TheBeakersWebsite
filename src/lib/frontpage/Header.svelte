<!-- src/lib/frontpage/Header.svelte -->
<script lang="ts">
	import { fade } from 'svelte/transition';
	let menuOpen = false;
	import { Menu, X } from 'lucide-svelte';

	const mainCategories = [
		{ name: 'Biology', path: '/biology' },
		{ name: 'Chemistry', path: '/chemistry' },
		{ name: 'Physics', path: '/physics' },
		{ name: 'Earth Science', path: '/earth' }
		// Add more primary categories here if they have pages
	];
</script>

<header class="fixed top-0 z-50 w-full bg-white">
	<div class="mx-auto max-w-7xl px-6">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo -->
			<a href="/" class="text-red-600">
				<img src="https://placeholder.pics/svg/128x32?text=Logo" alt="Logo" class="h-8 w-32" />
			</a>

			<!-- Navigation -->
			<nav class="hidden space-x-6 md:flex">
				{#each mainCategories as category}
					<a href={category.path} class="text-sm uppercase hover:text-red-600">
						{category.name}
					</a>
				{/each}
			</nav>

			<!-- Mobile Menu Button -->
			<button on:click={() => (menuOpen = !menuOpen)} class="md:hidden">
				<Menu class="h-6 w-6" />
			</button>
		</div>
	</div>

	<!-- Mobile Menu -->
	{#if menuOpen}
		<div transition:fade class="fixed inset-0 z-50 bg-white/95">
			<div class="p-6">
				<div class="mb-4 flex justify-end">
					<button on:click={() => (menuOpen = !menuOpen)} class="md:hidden">
						<X class="h-6 w-6" />
					</button>
				</div>
			</div>
		</div>
	{/if}
</header>
