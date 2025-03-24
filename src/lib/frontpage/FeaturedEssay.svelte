<!-- src/lib/components/FeaturedEssay.svelte -->
<script lang="ts">
	import type { FeaturedEssay } from '$lib/frontpage/types';
	export let featuredEssay: FeaturedEssay;
</script>

<section class="z-60 relative aspect-[5/2]">
	<picture>
		<source srcset={featuredEssay.featuredImage.url} media="(min-width: 1024px)" />
		<img
			src={featuredEssay.image.url}
			alt={featuredEssay.image.alt}
			class="h-full w-full object-cover"
		/>
	</picture>

	<div class="absolute inset-0 flex items-center justify-center bg-black/50">
		<div class="max-w-2xl px-4 text-center text-white">
			<h1 class="mb-4 font-serif text-4xl md:text-5xl">
				{featuredEssay.title}
			</h1>
			<p class="text-xl opacity-9">{featuredEssay.standfirstLong}</p>
		</div>
	</div>
</section>
