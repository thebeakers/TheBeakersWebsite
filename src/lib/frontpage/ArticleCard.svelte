<!-- src/lib/components/ArticleCard.svelte -->
<script lang="ts">
	import type { Article } from '$lib/frontpage/types';
	import { Play } from 'lucide-svelte';

	export let article: Article;
</script>

<article class="group relative">
	<div class="aspect-[4/3] overflow-hidden bg-gray-100">
		{#if article.type === 'video'}
			<svg class="absolute right-4 top-4 h-12 w-12 text-white"><Play /></svg>
		{/if}

		<img
			src={article.image.url}
			alt={article.image.alt}
			class="h-full w-full object-cover transition-transform group-hover:scale-105"
		/>
	</div>

	<div class="pt-4">
		<div class="mb-2 text-sm uppercase tracking-wide text-gray-500">
			{article.primaryTopic.title}
		</div>
		<h3 class="mb-2 font-serif text-xl">
			<a href={`/${article.slug}`} class="hover:text-red-600">
				{article.title}
			</a>
		</h3>
		<p class="line-clamp-3 text-gray-600">{article.standfirstShort}</p>
	</div>
</article>
