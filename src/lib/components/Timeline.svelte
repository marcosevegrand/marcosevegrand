<script lang="ts">
	import SectionReveal from './SectionReveal.svelte';
	import { timeline, type TimelineEntry } from '$lib/data/portfolio';

	type FilterType = 'featured' | 'all' | TimelineEntry['type'];

	let activeFilter: FilterType = $state('featured');

	const filters: { value: FilterType; label: string }[] = [
		{ value: 'featured', label: 'Featured' },
		{ value: 'work', label: 'Work' },
		{ value: 'education', label: 'Education' },
		{ value: 'course', label: 'Courses' },
		{ value: 'certification', label: 'Certifications' },
		{ value: 'all', label: 'All' }
	];

	const typeLabels: Record<TimelineEntry['type'], string> = {
		work: 'Work',
		education: 'Education',
		course: 'Course',
		certification: 'Certification'
	};

	const typeColors: Record<TimelineEntry['type'], string> = {
		work: 'var(--accent)',
		education: 'var(--secondary-accent)',
		course: '#0f9d8a',
		certification: '#66bb6a'
	};

	const filterColors: Record<Exclude<FilterType, 'all'>, string> = {
		featured: 'var(--text)',
		work: typeColors.work,
		education: typeColors.education,
		course: typeColors.course,
		certification: typeColors.certification
	};

	function entryReference(entry: TimelineEntry) {
		if (entry.type === 'certification') return entry.certificationId;
		if (entry.type === 'course') return entry.courseId;
		return undefined;
	}

	function entryReferenceLabel(entry: TimelineEntry) {
		if (entry.type === 'certification') return 'Certification ID';
		if (entry.type === 'course') return 'Course ID';
		return undefined;
	}

	function hasDetails(entry: TimelineEntry) {
		return (entry.details?.length ?? 0) > 0;
	}

	function hasKeywords(entry: TimelineEntry) {
		return (entry.keywords?.length ?? 0) > 0;
	}

	function usesSeparateOrgLine(entry: TimelineEntry) {
		return entry.type === 'course' || entry.type === 'certification';
	}

	let filtered = $derived(
		activeFilter === 'featured'
			? timeline.filter((entry) => entry.featured)
			: activeFilter === 'all'
				? timeline
				: timeline.filter((entry) => entry.type === activeFilter)
	);
</script>

<SectionReveal id="timeline" class="content-section">
	<p class="section-label">// Experience, Education & Credentials</p>

	<div class="timeline-filters" role="group" aria-label="Filter timeline entries">
		{#each filters as f (f.value)}
			<button
				class="filter-btn"
				class:active={activeFilter === f.value}
				style={activeFilter === f.value && f.value !== 'all' ? `color: ${filterColors[f.value]}; border-color: ${filterColors[f.value]}` : ''}
				onclick={() => (activeFilter = f.value)}
			>
				{f.label}
			</button>
		{/each}
	</div>

	<div class="timeline">
		{#if filtered.length === 0}
			<p class="timeline-empty muted">No timeline entries in this view yet.</p>
		{:else}
			{#each filtered as entry, i (entry.id)}
			<div class="timeline-entry">
				<div class="timeline-rail">
					<span class="timeline-dot" style="background: {typeColors[entry.type]}"></span>
					{#if i < filtered.length - 1}
						<span class="timeline-line"></span>
					{/if}
				</div>

				<div class="timeline-content">
					<div class="timeline-top">
						<span class="timeline-date">{entry.date}</span>
						<span class="timeline-type" style="color: {typeColors[entry.type]}">{typeLabels[entry.type]}</span>
					</div>

					{#if usesSeparateOrgLine(entry)}
						<h3 class="timeline-title timeline-title-compact">{entry.title}</h3>
						<p class="timeline-org muted">
							{#if entry.orgHref}
								<a href={entry.orgHref} target="_blank" rel="noopener noreferrer" class="timeline-org-link">{entry.org}</a>
							{:else}
								{entry.org}
							{/if}
						</p>
					{:else}
						<h3 class="timeline-title">
							{entry.title}
							<span class="timeline-at">@</span>
							{#if entry.orgHref}
								<a href={entry.orgHref} target="_blank" rel="noopener noreferrer" class="timeline-org-link timeline-org-inline">{entry.org}</a>
							{:else}
								<span class="timeline-org-inline">{entry.org}</span>
							{/if}
						</h3>
					{/if}
					{#if hasKeywords(entry)}
						<div class="timeline-keywords" aria-label="Keywords">
							{#each entry.keywords as keyword (keyword)}
								<span class="timeline-keyword">{keyword}</span>
							{/each}
						</div>
					{/if}
					{#if entryReference(entry) && entryReferenceLabel(entry)}
						<p class="timeline-grade">{entryReferenceLabel(entry)}: {entryReference(entry)}</p>
					{/if}
					{#if entry.grade}
						<p class="timeline-grade">Grade: {entry.grade}</p>
					{/if}

					{#if hasDetails(entry)}
						<details class="timeline-details">
							<summary class="details-toggle">Details</summary>
							<ul class="details-list">
								{#each entry.details ?? [] as detail (detail)}
									<li>{detail}</li>
								{/each}
							</ul>
						</details>
					{/if}
				</div>
			</div>
		{/each}
		{/if}
	</div>
</SectionReveal>

<style>
	.timeline-filters {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.filter-btn {
		appearance: none;
		border: 1px solid var(--border);
		background: var(--surface);
		padding: 0.35rem 0.75rem;
		font-size: 0.82rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: var(--muted);
		cursor: pointer;
		border-radius: 4px;
		transition: color 0.15s ease, border-color 0.15s ease;
		font-family: var(--font-sans);
	}

	.filter-btn:hover {
		color: var(--text);
		border-color: var(--text);
	}

	.filter-btn.active {
		color: var(--accent);
		border-color: var(--accent);
	}

	.timeline {
		display: flex;
		flex-direction: column;
	}

	.timeline-entry {
		display: grid;
		grid-template-columns: 24px 1fr;
		gap: 1rem;
	}

	/* Left rail */
	.timeline-rail {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 0.35rem;
	}

	.timeline-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		flex-shrink: 0;
	}

	.timeline-line {
		width: 1px;
		flex: 1;
		background: var(--border);
	}

	/* Right content */
	.timeline-content {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		padding-bottom: 2rem;
	}

	.timeline-top {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.timeline-date {
		font-size: 0.82rem;
		color: var(--muted);
		font-family: var(--font-sans);
	}

	.timeline-type {
		font-size: 0.72rem;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		font-family: var(--font-sans);
	}

	.timeline-title {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		column-gap: 0.35rem;
		row-gap: 0.05rem;
		font-size: clamp(1.34rem, 2.55vw, 1.86rem);
		margin: 0;
		font-family: var(--font-sans);
		font-weight: 700;
		line-height: 1.16;
	}

	.timeline-title-compact {
		font-size: clamp(1.12rem, 2vw, 1.46rem);
	}

	.timeline-org {
		margin: 0;
		font-size: 0.94rem;
		font-family: var(--font-sans);
	}

	.timeline-at {
		color: var(--muted);
		font-weight: 500;
	}

	.timeline-org-inline {
		color: var(--muted);
		font-weight: 450;
		font-size: 0.72em;
	}

	.timeline-org-link {
		color: inherit;
		text-decoration: underline;
		text-decoration-color: color-mix(in srgb, var(--accent) 40%, transparent);
		text-decoration-thickness: 1px;
		text-underline-offset: 0.14em;
		transition: color 0.15s ease, text-decoration-color 0.15s ease;
	}

	.timeline-org-link:hover {
		color: var(--text);
		text-decoration-color: var(--accent);
	}

	.timeline-keywords {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
		margin-top: 0.1rem;
	}

	.timeline-keyword {
		display: inline-flex;
		align-items: center;
		padding: 0.22rem 0.55rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--muted) 70%, var(--surface));
		color: var(--bg);
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		font-family: var(--font-sans);
	}

	.timeline-grade {
		margin: 0;
		font-size: 0.9rem;
		color: var(--muted);
		font-family: var(--font-sans);
	}

	.timeline-empty {
		margin: 0;
		font-family: var(--font-sans);
		font-size: 1rem;
	}

	/* Expandable details */
	.timeline-details {
		margin-top: 0.25rem;
	}

	.details-toggle {
		cursor: pointer;
		font-size: 0.86rem;
		font-weight: 700;
		color: var(--text);
		list-style: none;
		user-select: none;
		font-family: var(--font-sans);
	}

	.details-toggle::-webkit-details-marker {
		display: none;
	}

	.details-toggle::before {
		content: '+ ';
	}

	.timeline-details[open] .details-toggle::before {
		content: '− ';
	}

	.details-list {
		margin: 0.4rem 0 0;
		padding-left: 1rem;
		color: var(--muted);
		font-size: 0.96rem;
		font-family: var(--font-sans);
	}

	.details-list li {
		margin-bottom: 0.2rem;
	}

	@media (max-width: 640px) {
		.timeline-entry {
			grid-template-columns: 16px 1fr;
			gap: 0.75rem;
		}
	}
</style>
