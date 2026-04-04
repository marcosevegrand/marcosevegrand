<script lang="ts">
	import SectionReveal from './SectionReveal.svelte';
	import { theme } from '$lib/theme.svelte';

	interface Props {
		username?: string;
		totalContributions?: number | null;
		graphSvgLight?: string | null;
		graphSvgDark?: string | null;
	}

	let {
		username = 'marcosevegrand',
		totalContributions = null,
		graphSvgLight = null,
		graphSvgDark = null
	}: Props = $props();

	let chartSvg = $derived(theme.current === 'dark' ? graphSvgDark : graphSvgLight);
	let legendStops = $derived(
		theme.current === 'dark'
			? ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']
			: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']
	);
</script>

<SectionReveal id="github-activity" class="content-section">
	<p class="section-label">// GitHub Activity</p>

	<div class="activity-shell">
		<div class="activity-meta">
			<p class="activity-total mono">
				{#if totalContributions !== null}
					{totalContributions} contributions in the last year
				{:else}
					Contribution activity in the last year
				{/if}
			</p>

			<div class="activity-legend" aria-label="Contribution intensity scale">
				<span class="legend-label">Less</span>
				<div class="legend-scale" aria-hidden="true">
					{#each legendStops as stop, index (index)}
						<span class="legend-cell" style={`background: ${stop}`}></span>
					{/each}
				</div>
				<span class="legend-label">More</span>
			</div>
		</div>

		{#if !chartSvg}
			<p class="activity-fallback">
				The contribution graph is temporarily unavailable. View the full activity on
				<a href={`https://github.com/${username}`} target="_blank" rel="noopener noreferrer">
					GitHub
				</a>.
			</p>
		{:else}
			<div class="activity-graph-wrap" role="img" aria-label={`GitHub contribution graph for ${username}`}>
				<div class="activity-graph">{@html chartSvg}</div>
			</div>
		{/if}
	</div>
</SectionReveal>

<style>
	.activity-shell {
		display: grid;
		gap: 1rem;
	}

	.activity-meta {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.9rem 1.25rem;
	}

	.activity-total {
		margin: 0;
		font-size: 0.95rem;
		letter-spacing: 0.02em;
		color: var(--text);
	}

	.activity-legend {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
	}

	.legend-label {
		font-size: 0.82rem;
		color: var(--muted);
	}

	.legend-scale {
		display: inline-flex;
		gap: 0.28rem;
	}

	.legend-cell {
		display: block;
		width: 12px;
		height: 12px;
		border-radius: 2px;
		border: 1px solid color-mix(in srgb, var(--border) 85%, transparent);
	}

	.activity-graph-wrap {
		overflow-x: auto;
		overflow-y: hidden;
		padding-bottom: 0.2rem;
	}

	.activity-graph {
		display: block;
		min-width: 720px;
		width: 100%;
		height: auto;
	}

	.activity-graph :global(svg) {
		display: block;
		min-width: 720px;
		width: 100%;
		height: auto;
	}

	.activity-fallback {
		margin: 0;
		font-size: 0.98rem;
		line-height: 1.6;
		color: var(--muted);
	}

	.activity-fallback a {
		color: var(--accent);
		font-weight: 600;
	}

	@supports not (background: color-mix(in srgb, white 50%, black)) {
		.legend-cell {
			background: var(--accent);
		}
	}

	@media (max-width: 720px) {
		.activity-meta {
			align-items: flex-start;
			flex-direction: column;
		}

		.legend-cell {
			width: 11px;
			height: 11px;
		}
	}
</style>