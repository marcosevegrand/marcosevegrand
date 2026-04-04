<script lang="ts">
	import { onMount } from 'svelte';

	let scrollY = $state(0);
	let docHeight = $state(1);
	let winHeight = $state(1);

	function update() {
		docHeight = document.documentElement.scrollHeight;
		winHeight = window.innerHeight;
	}

	onMount(() => {
		update();
		window.addEventListener('resize', update, { passive: true });
		return () => window.removeEventListener('resize', update);
	});

	let ratio = $derived(docHeight - winHeight > 0 ? scrollY / (docHeight - winHeight) : 0);
	let clamped = $derived(Math.min(Math.max(ratio, 0), 1));
</script>

<svelte:window bind:scrollY onscroll={update} />

<div class="scroll-progress" aria-hidden="true">
	<span style="transform: scaleX({clamped})"></span>
</div>
