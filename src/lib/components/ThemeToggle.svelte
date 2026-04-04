<script lang="ts">
	import 'theme-toggles/css/classic.css';
	import { theme } from '$lib/theme.svelte';

	let isDark = $derived(theme.current === 'dark');

	function handleToggle() {
		theme.toggle();
	}
</script>

<button
	type="button"
	class="theme-toggle theme-switch"
	class:is-dark={isDark}
	class:theme-toggle--toggled={isDark}
	onclick={handleToggle}
	aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
	aria-pressed={isDark}
	title="Toggle theme"
>
	<span class="theme-toggle-sr">Toggle theme</span>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
		width="1em"
		height="1em"
		fill="currentColor"
		stroke-linecap="round"
		class="theme-toggle__classic"
		viewBox="0 0 32 32"
	>
		<clipPath id="theme-toggle__classic__cutout">
			<path d="M0-5h30a1 1 0 0 0 9 13v24H0Z" />
		</clipPath>
		<g clip-path="url(#theme-toggle__classic__cutout)">
			<circle cx="16" cy="16" r="9.34" />
			<g stroke="currentColor" stroke-width="1.5">
				<path d="M16 5.5v-4" />
				<path d="M16 30.5v-4" />
				<path d="M1.5 16h4" />
				<path d="M26.5 16h4" />
				<path d="m23.4 8.6 2.8-2.8" />
				<path d="m5.7 26.3 2.9-2.9" />
				<path d="m5.8 5.8 2.8 2.8" />
				<path d="m23.4 23.4 2.9 2.9" />
			</g>
		</g>
	</svg>
</button>

<style>
	.theme-switch {
		position: fixed;
		top: clamp(1rem, 2.2vw, 1.8rem);
		right: clamp(1rem, 3vw, 2.4rem);
		z-index: 45;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.15rem;
		color: var(--text);
		border: 0;
		background: transparent;
		box-shadow: none;
		backdrop-filter: none;
		-webkit-backdrop-filter: none;
	}

	.theme-switch:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 4px;
	}

	.theme-switch :global(.theme-toggle__classic) {
		width: 2rem;
		height: 2rem;
		display: block;
	}

	.theme-switch.is-dark {
		background: transparent;
		box-shadow: none;
	}

	.theme-switch:hover {
		color: var(--accent);
	}

	@media (max-width: 640px) {
		.theme-switch :global(.theme-toggle__classic) {
			width: 1.8rem;
			height: 1.8rem;
		}
	}
</style>