<script lang="ts">
	import { createElement, type ComponentType } from 'react';
	import { createRoot, type Root } from 'react-dom/client';
	import {
		AWS,
		Azure,
		Bash,
		C,
		Cloudflare,
		Docker,
		Git,
		GitHubDark,
		GitHubLight,
		Go,
		Kubernetes
	} from 'developer-icons';
	import { theme, type ThemeMode } from '$lib/theme.svelte';
	import SectionReveal from './SectionReveal.svelte';
	import { techStack, type TechStackItem } from '$lib/data/portfolio';

	type IconProps = { size?: number; className?: string; 'aria-hidden'?: boolean };
	type IconComponent = ComponentType<IconProps>;
	type MountIconParams = { iconId: TechStackItem['id']; mode: ThemeMode };

	const iconMap: Record<Exclude<TechStackItem['id'], 'github'>, IconComponent> = {
		go: Go,
		git: Git,
		bash: Bash,
		docker: Docker,
		kubernetes: Kubernetes,
		aws: AWS,
		azure: Azure
	};

	function resolveIcon(iconId: TechStackItem['id'], mode: ThemeMode): IconComponent {
		if (iconId === 'github') {
			return mode === 'dark' ? GitHubLight : GitHubDark;
		}

		return iconMap[iconId];
	}

	function mountIcon(node: HTMLElement, params: MountIconParams) {
		let root: Root | undefined;

		function render({ iconId, mode }: MountIconParams) {
			root ??= createRoot(node);
			root.render(
				createElement(resolveIcon(iconId, mode), {
					size: 68,
					className: 'stack-icon-svg',
					'aria-hidden': true
				})
			);
		}

		render(params);

		return {
			update(nextParams: MountIconParams) {
				render(nextParams);
			},
			destroy() {
				root?.unmount();
			}
		};
	}

	function resolveIconsPerLine(total: number) {
		for (const candidate of [5, 4, 3, 2, 1]) {
			if (candidate <= total && total % candidate === 0) {
				return candidate;
			}
		}

		return 1;
	}

	function chunkItems(items: TechStackItem[], chunkSize: number) {
		const chunks: TechStackItem[][] = [];

		for (let index = 0; index < items.length; index += chunkSize) {
			chunks.push(items.slice(index, index + chunkSize));
		}

		return chunks;
	}

	const iconsPerLine = resolveIconsPerLine(techStack.length);
	const stackRows = chunkItems(techStack, iconsPerLine);
</script>

<SectionReveal id="tech-stack" class="content-section">
	<p class="section-label">// Tech Stack</p>

	<div class="stack-rows" role="list" aria-label="Technologies I work with">
		{#each stackRows as row, rowIndex (`row-${rowIndex}`)}
			<div class="stack-row" role="presentation" style:--column-count={row.length}>
				{#each row as item (item.id)}
					<div class="stack-card" role="listitem">
						<div
							class="stack-icon"
							aria-hidden="true"
							use:mountIcon={{ iconId: item.id, mode: theme.current }}
						></div>
						<span class="stack-label">{item.label}</span>
					</div>
				{/each}
			</div>
		{/each}
	</div>
</SectionReveal>

<style>
	.stack-rows {
		display: grid;
		gap: 1.6rem;
		width: 100%;
	}

	.stack-row {
		display: grid;
		grid-template-columns: repeat(var(--column-count), minmax(0, 1fr));
		justify-content: center;
		align-items: start;
		gap: 1.75rem;
		width: 100%;
	}

	.stack-card {
		display: grid;
		justify-items: center;
		gap: 0.9rem;
		padding: 1.35rem 0.5rem 1.1rem;
		width: 100%;
	}

	.stack-icon {
		display: grid;
		place-items: center;
		width: 4.75rem;
		height: 4.75rem;
	}

	.stack-icon :global(.stack-icon-svg) {
		display: block;
		width: 4.25rem;
		height: 4.25rem;
	}

	.stack-label {
		font-size: 0.84rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		text-align: center;
		color: var(--muted);
	}

	@media (max-width: 900px) {
		.stack-rows {
			gap: 1.25rem;
		}

		.stack-row {
			gap: 1.1rem;
		}

		.stack-icon {
			width: 4.25rem;
			height: 4.25rem;
		}

		.stack-icon :global(.stack-icon-svg) {
			width: 3.8rem;
			height: 3.8rem;
		}
	}

	@media (max-width: 560px) {
		.stack-rows {
			gap: 1rem;
		}

		.stack-card {
			gap: 0.75rem;
			padding-inline: 0.25rem;
		}

		.stack-row {
			gap: 0.7rem;
		}

		.stack-icon {
			width: 3.6rem;
			height: 3.6rem;
		}

		.stack-icon :global(.stack-icon-svg) {
			width: 3.2rem;
			height: 3.2rem;
		}

		.stack-label {
			font-size: 0.76rem;
		}
	}
</style>