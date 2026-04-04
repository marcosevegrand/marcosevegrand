<script lang="ts">
	import SectionReveal from './SectionReveal.svelte';
	import { projects, type Project } from '$lib/data/portfolio';

	let activeIndex = $state(0);
	let showPreview = $state(false);
	let previewTop = $state(0);

	function handleMouseEnter(index: number, e: MouseEvent) {
		activeIndex = index;
		if (projects[index].preview) {
			const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
			previewTop = rect.top + rect.height / 2;
			showPreview = true;
		}
	}

	function handleMouseLeave() {
		showPreview = false;
	}

	let activeProject: Project = $derived(projects[activeIndex]);
	let previewSrc: string = $derived(activeProject?.preview?.src ?? '');
	let previewAlt: string = $derived(activeProject?.preview?.alt ?? '');
</script>

<SectionReveal id="projects" class="content-section">
	<p class="section-label">// Selected Work</p>

	<div class="project-list">
		{#each projects as project, i}
			<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
			<article
				class="project-entry"
				class:active={activeIndex === i}
				tabindex="0"
				onmouseenter={(e) => handleMouseEnter(i, e)}
				onmouseleave={handleMouseLeave}
				onfocus={(e) => handleMouseEnter(i, e as unknown as MouseEvent)}
			>
				<div class="project-header">
					<span class="project-year mono">{project.year}</span>
					<h2 class="project-name">{project.name}</h2>
				</div>
				<p class="project-summary muted">{project.summary}</p>
				<div class="project-footer">
					<div class="tag-row">
						{#each project.stack as tech}
							<span class="tag-pill">{tech}</span>
						{/each}
					</div>
					{#if project.demo || project.github}
						<div class="project-links">
							{#if project.demo}
								<a href={project.demo} target="_blank" rel="noopener noreferrer" class="project-link">Live</a>
							{/if}
							{#if project.github}
								<a href={project.github} target="_blank" rel="noopener noreferrer" class="project-link">GitHub</a>
							{/if}
						</div>
					{/if}
				</div>
			</article>
		{/each}
	</div>
</SectionReveal>

{#if showPreview && previewSrc}
	<div
		class="floating-preview"
		style="top: {previewTop}px;"
		aria-hidden="true"
	>
		<img src={previewSrc} alt={previewAlt} />
	</div>
{/if}

<style>
	.project-list {
		display: grid;
		gap: 0;
	}

	.project-entry {
		display: grid;
		gap: 0.5rem;
		padding: 1.4rem 0;
		border-bottom: 1px solid var(--border);
		cursor: default;
		transition: opacity 0.18s ease;
	}

	.project-entry:first-child {
		padding-top: 0;
	}

	.project-entry:last-child {
		border-bottom: 0;
		padding-bottom: 0;
	}

	.project-entry:hover,
	.project-entry:focus-visible,
	.project-entry.active {
		outline: none;
	}

	/* Dim non-hovered entries when any entry is hovered */
	.project-list:hover .project-entry:not(:hover) {
		opacity: 0.72;
	}

	.project-header {
		display: flex;
		align-items: baseline;
		gap: 1rem;
	}

	.project-year {
		font-size: 0.84rem;
		color: var(--muted);
		flex-shrink: 0;
	}

	.project-name {
		font-size: clamp(1.6rem, 3vw, 2.4rem);
	}

	.project-summary {
		margin: 0;
		max-width: 64ch;
		font-size: 1rem;
	}

	.project-footer {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;
	}

	.project-links {
		display: flex;
		gap: 0.75rem;
	}

	.project-link {
		font-size: 0.88rem;
		font-weight: 700;
		color: var(--accent);
		transition: opacity 0.15s ease;
	}

	.project-link:hover {
		opacity: 0.7;
	}

	/* Floating preview */
	.floating-preview {
		position: fixed;
		right: clamp(4rem, 10vw, 9rem);
		z-index: 30;
		pointer-events: none;
		transform: translateY(-50%);
		border: 1px solid var(--border);
		background: var(--surface);
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
		border-radius: 6px;
		overflow: hidden;
		opacity: 0;
		animation: preview-in 0.2s ease forwards;
	}

	.floating-preview img {
		display: block;
		max-width: min(480px, 35vw);
		max-height: 50vh;
		width: auto;
		height: auto;
	}

	@media (max-width: 1200px) {
		.floating-preview {
			display: none;
		}
	}

	@keyframes preview-in {
		from {
			opacity: 0;
			transform: translateY(calc(-50% + 8px)) scale(0.97);
		}
		to {
			opacity: 1;
			transform: translateY(-50%) scale(1);
		}
	}

	@media (max-width: 960px) {
		.floating-preview {
			display: none;
		}

		.project-header {
			flex-direction: column;
			gap: 0.2rem;
		}
	}
</style>
