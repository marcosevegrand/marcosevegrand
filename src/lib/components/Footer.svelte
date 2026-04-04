<script lang="ts">
	import SocialIcons from './SocialIcons.svelte';
	import { hero } from '$lib/data/portfolio';
</script>

<footer class="footer">
	<div class="footer-inner">
		<p class="footer-copy">Marco Sèvegrand · {new Date().getFullYear()}</p>
		<SocialIcons links={hero.socials} size={16} />
		<a href={hero.cvHref} download class="footer-cv">Download CV</a>
	</div>
</footer>

<style>
	.footer {
		border-top: 1px solid var(--border);
		padding: 2rem 0;
		margin-top: 2rem;
	}

	.footer-inner {
		width: min(1080px, calc(100vw - 2rem));
		margin: 0 auto;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 1.2rem;
	}

	.footer-copy {
		margin: 0;
		font-size: 0.82rem;
		color: var(--muted);
	}

	.footer-cv {
		font-size: 0.75rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--muted);
		transition: color 0.2s ease;
	}

	.footer-cv:hover {
		color: var(--text);
	}
</style>
