<script lang="ts">
	import SectionReveal from './SectionReveal.svelte';
</script>

<SectionReveal id="about" class="content-section">
	<div class="about-copy">
		<p class="about-block">
			I am a <strong class="about-emphasis">third-year Software Engineering student</strong>,
			and after finishing my bachelor's I intend to pursue a
			<strong class="about-emphasis">master's in cybersecurity</strong>.
		</p>

		<p class="about-block">
			<span class="about-underline">I am proactive, learn fast, and like working in a team</span>.
			I use AI to move faster and explore ideas, but I
			<strong class="about-emphasis">stay responsible for the result</strong> and the
			decisions behind it.
		</p>

		<p class="about-block">
			I am especially interested in <strong class="about-emphasis">cybersecurity</strong>,
			<strong class="about-emphasis">infrastructure</strong>, and
			<strong class="about-emphasis">systems architecture</strong>, and I want to keep building
			knowledge in those areas.
		</p>
	</div>
</SectionReveal>

<style>
	.about-copy {
		display: grid;
		gap: 1rem;
		max-width: 72ch;
	}

	.about-block {
		margin: 0;
		font-family: var(--font-sans);
		font-size: clamp(1.08rem, 1.65vw, 1.32rem);
		line-height: 1.72;
		color: var(--text);
	}

	.about-emphasis {
		font-weight: 700;
		color: var(--text);
	}

	.about-underline {
		text-decoration: underline;
		text-decoration-color: color-mix(in srgb, var(--accent) 70%, transparent);
		text-decoration-thickness: 0.12em;
		text-underline-offset: 0.18em;
	}
</style>
