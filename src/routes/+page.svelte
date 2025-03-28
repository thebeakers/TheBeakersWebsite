<script lang="ts">
	import Header from '$lib/frontpage/Header.svelte';
	import FeaturedEssay from '$lib/frontpage/FeaturedEssay.svelte';
	import ArticleGrid from '$lib/frontpage/ArticleGrid.svelte';
	import Footer from '$lib/frontpage/Footer.svelte';

	let { data } = $props();
	let dataAAAAAA = data.data;
</script>

<div class="overflow-hidden font-sans">
	<Header />
	<main class="relative pt-16 md:pt-20">
		<FeaturedEssay featuredEssay={dataAAAAAA.featuredEssay} />
		<ArticleGrid articles={dataAAAAAA.articles} />
	</main>

	<Footer />
</div>
