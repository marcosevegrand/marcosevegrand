type ThemeMode = 'light' | 'dark';

class ThemeController {
	current = $state<ThemeMode>('light');
	initialized = $state(false);

	private apply(mode: ThemeMode) {
		if (typeof document === 'undefined') return;

		document.documentElement.dataset.theme = mode;
		document.documentElement.style.colorScheme = mode;
	}

	init = () => {
		if (typeof window === 'undefined' || this.initialized) return;

		this.current = 'light';
		this.apply('light');
		window.localStorage.removeItem('theme-mode');
		this.initialized = true;
	};

	toggle = () => {
		const next: ThemeMode = this.current === 'light' ? 'dark' : 'light';

		this.current = next;
		this.apply(next);
	};
}

export const theme = new ThemeController();
export type { ThemeMode };