<script>
	import Question from '$lib/Questions/question.svelte';
	import { questions } from '$lib/types';
	import { selected_answers } from '$lib/stores';
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';

	let bakingMessage = 'Still Baking...';
	let dots = '';
	let dotCount = 0;
	function submit() {
		console.log($selected_answers);
		let correct_answers = 0;
		for (let i = 0; i < questions.length; i++) {
			if ($selected_answers[i] === questions[i].correct_answer) {
				correct_answers++;
			}
		}
		console.log(correct_answers);
		return correct_answers;
	}

	onMount(() => {
		const interval = setInterval(() => {
			dotCount = (dotCount + 1) % 4;
			dots = '.'.repeat(dotCount);
			bakingMessage = `Still Baking${dots}`;
		}, 500);

		return () => clearInterval(interval); // Cleanup on unmount
	});
</script>

<main class="flex h-full items-center justify-center overflow-y-auto p-4">
	<div class="text-center">
		<h1 class="mb-4 text-4xl font-bold text-gray-700">{bakingMessage}</h1>
		<p class="text-lg text-gray-500">
			We're working hard to bring you something amazing. Check back soon!
		</p>
		<img src="https://loremflickr.com/1080/720" />
	</div>
</main>
