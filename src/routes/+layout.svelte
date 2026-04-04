<script lang="ts">
	import { onMount } from 'svelte';
	import ScrollProgress from '$lib/components/ScrollProgress.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { theme } from '$lib/theme.svelte';
	import type { Snippet } from 'svelte';
	import '../app.css';

	let { children }: { children: Snippet } = $props();

	onMount(() => {
		theme.init();
	});
</script>

<div class="grain" aria-hidden="true"></div>
<ScrollProgress />
<ThemeToggle />

<main class="page-shell">
	{@render children()}
</main>

<Footer />
