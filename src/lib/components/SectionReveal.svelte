<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		id?: string;
		class?: string;
		children: Snippet;
	}

	let { id, class: className = '', children }: Props = $props();

	let el: HTMLElement | undefined = $state();
	let visible = $state(false);

	$effect(() => {
		if (!el) return;

		const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReduced) {
			visible = true;
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					visible = true;
					observer.disconnect();
				}
			},
			{ threshold: 0.12 }
		);

		observer.observe(el);
		return () => observer.disconnect();
	});
</script>

<section
	bind:this={el}
	{id}
	class="section-reveal {className}"
	class:section-reveal--visible={visible}
>
	{@render children()}
</section>

<style>
	.section-reveal {
		opacity: 0;
		transform: translateY(24px);
		transition:
			opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1),
			transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.section-reveal--visible {
		opacity: 1;
		transform: translateY(0);
	}
</style>
