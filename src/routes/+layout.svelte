<script lang="ts">
	import { onMount } from 'svelte';
	import ScrollProgress from '$lib/components/ScrollProgress.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import ThemeToggle from '$lib/components/ThemeToggle.svelte';
	import { theme } from '$lib/theme.svelte';
	import type { Snippet } from 'svelte';
	import '../app.css';

	let { children }: { children: Snippet } = $props();
	let warningOpen = $state(true);

	function dismissWarning() {
		warningOpen = false;
	}

	onMount(() => {
		theme.init();
	});

	$effect(() => {
		if (typeof document === 'undefined') return;

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = warningOpen ? 'hidden' : previousOverflow;

		return () => {
			document.body.style.overflow = previousOverflow;
		};
	});
</script>

<div class="grain" aria-hidden="true"></div>
<ScrollProgress />
<ThemeToggle />

<main class="page-shell">
	{@render children()}
</main>

<Footer />

{#if warningOpen}
	<div class="site-warning" role="dialog" aria-modal="true" aria-labelledby="site-warning-title" aria-describedby="site-warning-copy">
		<div class="site-warning__panel">
			<h1 id="site-warning-title" class="site-warning__title">Please note</h1>
			<p id="site-warning-copy" class="site-warning__copy">
				This website is a personal preview and does not fully represent current reality. Some technologies and achievements shown here reflect goals, active learning, or work in progress rather than deep professional expertise.
			</p>
			<button class="site-warning__action" type="button" onclick={dismissWarning}>Continue</button>
		</div>
	</div>
{/if}

<style>
	.site-warning {
		position: fixed;
		inset: 0;
		z-index: 200;
		display: grid;
		place-items: center;
		padding: 1.25rem;
		background: color-mix(in srgb, var(--bg) 80%, black 20%);
		backdrop-filter: blur(10px);
	}

	:global(html[data-theme='dark']) .site-warning {
		background: color-mix(in srgb, var(--bg) 88%, black 12%);
	}

	.site-warning__panel {
		width: min(640px, 100%);
		padding: clamp(1.5rem, 4vw, 3rem);
		border: 1px solid color-mix(in srgb, var(--border) 88%, transparent);
		border-radius: 28px;
		background: color-mix(in srgb, var(--surface) 90%, transparent);
		box-shadow: 0 24px 80px rgba(0, 0, 0, 0.18);
	}

	.site-warning__title {
		margin: 0;
		font-family: var(--font-sans);
		font-size: clamp(1.5rem, 4vw, 2.2rem);
		font-weight: 700;
		letter-spacing: -0.03em;
		line-height: 1;
	}

	.site-warning__copy {
		margin: 1rem 0 0;
		font-size: clamp(1rem, 1.8vw, 1.18rem);
		line-height: 1.45;
		color: var(--text);
		font-family: var(--font-sans);
	}

	.site-warning__action {
		margin-top: 1.5rem;
		appearance: none;
		border: 1px solid var(--border);
		border-radius: 999px;
		padding: 0.8rem 1.2rem;
		background: var(--surface);
		color: var(--text);
		font: inherit;
		font-weight: 700;
		cursor: pointer;
		transition: transform 0.15s ease, border-color 0.15s ease;
	}

	.site-warning__action:hover {
		transform: translateY(-1px);
		border-color: var(--accent);
	}

	@media (max-width: 640px) {
		.site-warning__panel {
			border-radius: 22px;
		}

		.site-warning__action {
			width: 100%;
			justify-content: center;
		}
	}
</style>
