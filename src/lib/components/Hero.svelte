<script lang="ts">
	import SocialIcons from './SocialIcons.svelte';
	import LiveClock from './LiveClock.svelte';
	import { hero } from '$lib/data/portfolio';

	const [firstName, ...restName] = hero.name.split(' ');
	const lastName = restName.join(' ');
</script>

<section class="hero" id="hero">
	<p class="hero-role">{hero.role}</p>

	<h1 class="hero-name">
		<span>{firstName}</span>
		<span>{lastName}</span>
	</h1>

	<div class="hero-details">
		<div class="hero-meta">
			<p class="hero-location muted">
				{hero.location} · <LiveClock timezone={hero.timezone} />
			</p>
		</div>

		<div class="hero-actions">
			<SocialIcons links={hero.socials} size={24} />

			<a href={hero.cvHref} download class="cv-link">
				Download CV
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
					<polyline points="7 10 12 15 17 10" />
					<line x1="12" y1="15" x2="12" y2="3" />
				</svg>
			</a>
		</div>
	</div>
</section>

<style>
	.hero {
		--hero-inline-pad: 2rem;
		--hero-vertical-reserve: clamp(13.5rem, 26vh, 17rem);
		display: grid;
		justify-items: center;
		align-content: center;
		height: 100dvh;
		max-height: 100dvh;
		/* Break out of the 1080px .page-shell so the name can use full viewport width */
		width: 100vw;
		margin-left: calc(-50vw + 50%);
		margin-top: calc(-1 * var(--page-shell-pad-top, 1.5rem));
		padding: 2rem var(--hero-inline-pad);
		text-align: center;
		overflow: hidden;
	}

	.hero-role {
		margin: 0;
		color: var(--muted);
		font-size: 0.92rem;
		font-weight: 800;
		line-height: 1;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		font-family: var(--font-sans);
	}

	.hero-name {
		display: block;
		text-align: center;
		/* Asymmetric margins: font has more internal whitespace above than below */
		margin: clamp(1.4rem, 3.4vh, 2.4rem) 0 clamp(3.8rem, 8.5vh, 5.8rem);
		padding: 0;
		font-size: clamp(
			5rem,
			min(
				calc((100dvh - var(--hero-vertical-reserve)) / 1.82),
				calc((100vw - (var(--hero-inline-pad) * 2)) / 3.9)
			),
			14rem
		);
		line-height: 0.9;
		letter-spacing: -0.04em;
		color: var(--text);
		text-box-trim: both;
		text-box-edge: cap alphabetic;
	}

	.hero-name span {
		display: block;
	}

	.hero-details {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 0;
		gap: clamp(0.8rem, 1.5vh, 1.1rem);
	}

	.hero-meta {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4rem;
	}

	.hero-location {
		margin: 0;
		font-size: 1.05rem;
		line-height: 1.2;
	}

	.hero-actions {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.hero :global(.social-icons) {
		gap: 1.25rem;
	}

	.cv-link {
		display: inline-flex;
		align-items: center;
		gap: 0.48rem;
		padding: 0.7rem 1.2rem;
		font-size: 0.88rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--muted);
		border: 1px solid var(--border);
		border-radius: 999px;
		background: var(--surface);
		transition: color 0.2s ease, border-color 0.2s ease;
	}

	.cv-link:hover,
	.cv-link:focus-visible {
		color: var(--text);
		border-color: var(--text);
	}

	.cv-link:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
	}
</style>
