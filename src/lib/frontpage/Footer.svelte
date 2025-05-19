<!-- src/lib/components/Footer.svelte -->
<script lang="ts">
	import { ArrowUp } from 'lucide-svelte';

	let email = '';
	const currentYear = new Date().getFullYear();

	const socialLinks = [
		{ name: 'Facebook', url: '#', icon: 'facebook-icon' },
		{ name: 'Instagram', url: '#', icon: 'instagram-icon' },
		{ name: 'Bluesky', url: '#', icon: 'bluesky-icon' },
		{ name: 'YouTube', url: '#', icon: 'youtube-icon' }
	];

	const footerLinks = [
		{ title: 'Essays', url: '/essays' },
		{ title: 'Videos', url: '/videos' },
		{ title: 'Audio', url: '/audio' },
		{ title: 'Popular', url: '/popular' },
		{ title: 'About', url: '/about' },
		{ title: 'Donate', url: '/donate' },
		{ title: 'Newsletter', url: '/newsletter' }
	];
</script>

<footer class="border-t border-gray-200 bg-gray-50 text-gray-600">
	<div class="mx-auto p-6">
		<div class="mb-12 grid grid-cols-1 md:grid-cols-4">
			<!-- Logo Column -->
			<div class="md:col-span-1">
				<a href="/" class="mb-6 block">
					<img
						src="https://placeholder.pics/svg/138x28?text=Logo"
						alt="Logo"
						class="w-32 text-red-600"
					/>
				</a>
				<div class="space-y-2">
					{#each socialLinks as link}
						<a
							href={link.url}
							class="flex items-center space-x-2 transition-colors hover:text-red-600"
						>
							<img
								src={'https://placeholder.pics/svg/20x20?text=' + encodeURIComponent(link.name)}
								alt={link.name + ' icon'}
								class="h-5 w-5"
							/>
							<span class="text-sm">{link.name}</span>
						</a>
					{/each}
				</div>
			</div>

			<!-- Navigation Links -->
			<div class="grid grid-cols-2 gap-8 md:col-span-2"></div>

			<!-- Newsletter -->
			<div class="md:col-span-1">
				<h3 class="mb-4 text-sm font-semibold uppercase tracking-wide">Newsletter</h3>
				<form class="space-y-4" on:submit|preventDefault={() => {}}>
					<input
						type="email"
						bind:value={email}
						placeholder="Enter your email"
						class="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-red-500"
					/>
					<button
						type="submit"
						class="w-full rounded bg-red-600 px-4 py-2 text-sm text-white transition-colors hover:bg-red-700"
					>
						Subscribe
					</button>
				</form>
			</div>
		</div>

		<!-- Copyright -->
	</div>
	<div class="border-t border-gray-200 p-4 text-sm text-gray-500">
		<div class="flex flex-col items-center justify-between md:flex-row">
			<p>© {currentYear} The Beakers</p>
			<div class="mt-4 md:mt-0">
				<a href="/terms" class="transition-colors hover:text-red-600"> Terms &amp; Conditions </a>
				<a href="/privacy" class="transition-colors hover:text-red-600"> Privacy Policy </a>
			</div>
		</div>
	</div>
</footer>
