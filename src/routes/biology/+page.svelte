<script lang="ts">
	import Header from '$lib/frontpage/Header.svelte';
	import FeaturedEssay from '$lib/frontpage/FeaturedEssay.svelte';
	import ArticleGrid from '$lib/frontpage/ArticleGrid.svelte';
	import Footer from '$lib/frontpage/Footer.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	// data contains: pageTitle, featuredEssay, articles

	const isEmptyFeatured =
		data.featuredEssay?.id === `empty-featured-${data.pageTitle.toLowerCase()}`;
</script>

<div class="overflow-hidden font-sans">
	<Header />
	<main class="relative pt-16 md:pt-20">
		{#if data.featuredEssay && data.featuredEssay.id && !isEmptyFeatured}
			<FeaturedEssay featuredEssay={data.featuredEssay} />
		{:else if isEmptyFeatured}
			<FeaturedEssay featuredEssay={data.featuredEssay} />
		{:else if data.articles.length > 0}
			<section class="mx-auto w-full px-6 py-12 text-center">
				<h1 class="mb-4 font-serif text-4xl md:text-5xl">
					{data.pageTitle}
				</h1>
				<p class="text-xl opacity-90">
					Explore the latest essays and videos in {data.pageTitle}.
				</p>
			</section>
		{/if}

		{#if data.articles && data.articles.length > 0}
			<ArticleGrid articles={data.articles} />
		{:else if !isEmptyFeatured}
			<section class="mx-auto w-full px-6 py-8 text-center">
				<h2 class="mb-4 font-serif text-2xl">More Articles Coming Soon</h2>
				<p class="text-lg">
					No additional articles found in {data.pageTitle} at the moment. Check back soon!
				</p>
			</section>
		{/if}
	</main>
	<Footer />
</div>
