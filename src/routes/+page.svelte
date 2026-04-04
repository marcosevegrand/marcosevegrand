<script lang="ts">
	import Hero from '$lib/components/Hero.svelte';
	import About from '$lib/components/About.svelte';
	import GitHubActivity from '$lib/components/GitHubActivity.svelte';
	import Projects from '$lib/components/Projects.svelte';
	import TechStack from '$lib/components/TechStack.svelte';
	import Timeline from '$lib/components/Timeline.svelte';
	import { meta, sectionVisibility } from '$lib/data/portfolio';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>{meta.title}</title>
	<meta name="description" content={meta.description} />
</svelte:head>

{#if sectionVisibility.hero}
	<Hero />
{/if}

<About />

{#if sectionVisibility.techStack}
	<TechStack />
{/if}

{#if sectionVisibility.projects}
	<Projects />
{/if}

{#if sectionVisibility.timeline}
	<Timeline />
{/if}

{#if sectionVisibility.githubActivity}
	<GitHubActivity
		totalContributions={data.githubActivity.totalContributions}
		graphSvgLight={data.githubActivity.graphSvgLight}
		graphSvgDark={data.githubActivity.graphSvgDark}
	/>
{/if}
