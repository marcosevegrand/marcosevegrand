<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		timezone: string;
	}

	let { timezone }: Props = $props();
	let time = $state('--:--');

	onMount(() => {
		const formatter = new Intl.DateTimeFormat('en-GB', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
			timeZone: timezone
		});

		const sync = () => {
			time = formatter.format(new Date());
		};

		sync();
		const interval = setInterval(sync, 15000);
		return () => clearInterval(interval);
	});
</script>

<span class="live-clock mono">{time}</span>

<style>
	.live-clock {
		font-family: var(--font-mono);
		font-size: inherit;
		color: inherit;
		font-variant-numeric: tabular-nums;
	}
</style>
