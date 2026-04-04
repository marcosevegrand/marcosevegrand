<script lang="ts">
	import SectionReveal from './SectionReveal.svelte';
</script>

<SectionReveal id="about" class="content-section">
	<div class="about-copy">
		<p class="about-block">
			I bring what AI cannot replace: <strong class="about-emphasis">creativity, intuition,
			anticipation</strong>, and the <strong class="about-emphasis">judgment</strong>
			to know what matters before it becomes a problem.
		</p>

		<p class="about-block">
			I <strong class="about-emphasis">leverage AI</strong> to move fast, but I stay responsible
			for the work that matters most:
			<span class="about-underline">making tradeoffs clear</span>, catching edge cases early,
			and turning rough ideas into something solid enough to ship. I work well with people,
			adapt quickly, and <strong class="about-emphasis">communicate directly</strong>.
		</p>

		<p class="about-block">
			I graduated in <strong class="about-emphasis">Software Engineering</strong>, and I am
			now looking to go deeper into the parts of the craft that reward rigor and long-term
			thinking, especially <strong class="about-emphasis">software architecture</strong> and
			<strong class="about-emphasis">cybersecurity</strong>. I want to design systems that are
			<span class="about-underline">clear, resilient, and secure by default</span>.
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
