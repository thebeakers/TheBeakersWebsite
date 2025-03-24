<!-- src/lib/components/ArticleGrid.svelte -->
<script lang="ts">
	import ArticleCard from './ArticleCard.svelte';
	import type { Article } from '$lib/frontpage/types';
	export let articles: Article[];
</script>

<section class="mx-auto w-full px-6 py-16">
	<!-- You can adjust the max width below, or remove it entirely if you want full-width -->
	<div class="mx-auto">
		<h2 class="mb-12 font-serif text-2xl">Latest Essays & Videos</h2>
		<div class="grid gap-8 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]">
			{#each articles as article}
				<ArticleCard {article} />
			{/each}
		</div>
	</div>
</section>
