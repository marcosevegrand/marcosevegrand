import type { PageServerLoad } from './$types';

const USERNAME = 'marcosevegrand';
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const CELL_SIZE = 10;
const CELL_GAP = 3;
const LABEL_SPACE_X = 28;
const LABEL_SPACE_Y = 20;
const GRAPH_HEIGHT = 130;
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_LABELS = [
	{ row: 1, text: 'Mon' },
	{ row: 3, text: 'Wed' },
	{ row: 5, text: 'Fri' }
];

const GRAPH_PALETTES = {
	light: {
		mutedText: '#6b7280',
		empty: '#ebedf0',
		low: '#9be9a8',
		midLow: '#40c463',
		midHigh: '#30a14e',
		high: '#216e39'
	},
	dark: {
		mutedText: '#94a3b8',
		empty: '#161b22',
		low: '#0e4429',
		midLow: '#006d32',
		midHigh: '#26a641',
		high: '#39d353'
	}
} as const;

type GraphPalette = (typeof GRAPH_PALETTES)[keyof typeof GRAPH_PALETTES];

interface ContributionDay {
	date: string;
	level: number;
	count: number;
}

function toUtcDate(date: Date): Date {
	return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function formatDate(date: Date): string {
	return toUtcDate(date).toISOString().slice(0, 10);
}

function shiftDays(date: Date, days: number): Date {
	return new Date(date.getTime() + days * DAY_IN_MS);
}

function getContributionUrl(username: string, year: number): string {
	return `https://github.com/users/${username}/contributions?from=${year}-01-01&to=${year}-12-31`;
}

function getCellColor(level: number, palette: GraphPalette): string {
	switch (level) {
		case 0:
			return palette.empty;
		case 1:
			return palette.low;
		case 2:
			return palette.midLow;
		case 3:
			return palette.midHigh;
		default:
			return palette.high;
	}
}

function extractContributionDays(html: string): ContributionDay[] {
	const matches = html.matchAll(/<td\b([^>]*)><\/td>\s*<tool-tip\b([^>]*)>([^<]*)<\/tool-tip>/g);
	const days: ContributionDay[] = [];

	for (const match of matches) {
		const tdAttributes = match[1];
		const tooltipAttributes = match[2];
		const tooltipText = match[3].replace(/\s+/g, ' ').trim();

		const date = tdAttributes.match(/data-date="([^"]+)"/)?.[1];
		const level = Number.parseInt(tdAttributes.match(/data-level="(\d+)"/)?.[1] ?? '', 10);
		const id = tdAttributes.match(/id="([^"]+)"/)?.[1];
		const tooltipFor = tooltipAttributes.match(/for="([^"]+)"/)?.[1];

		if (!date || !Number.isFinite(level) || !id || id !== tooltipFor) {
			continue;
		}

		const countMatch = tooltipText.match(/([0-9,]+) contribution/i);
		const count = countMatch ? Number.parseInt(countMatch[1].replaceAll(',', ''), 10) : 0;

		days.push({ date, level, count: Number.isFinite(count) ? count : 0 });
	}

	return days;
}

function buildGraphSvg(days: ContributionDay[], startDate: Date, endDate: Date, palette: GraphPalette): string {
	const startSunday = shiftDays(startDate, -startDate.getUTCDay());
	const endSaturday = shiftDays(endDate, 6 - endDate.getUTCDay());
	const totalDays = Math.round((endSaturday.getTime() - startSunday.getTime()) / DAY_IN_MS) + 1;
	const weekCount = Math.ceil(totalDays / 7);
	const graphWidth = LABEL_SPACE_X + weekCount * (CELL_SIZE + CELL_GAP);
	const monthLabels: string[] = [];
	const cellRects: string[] = [];
	const lookup = new Map(days.map((day) => [day.date, day]));

	for (let weekIndex = 0; weekIndex < weekCount; weekIndex += 1) {
		const columnDate = shiftDays(startSunday, weekIndex * 7);
		const isMonthBoundary = columnDate.getUTCDate() <= 7;

		if (isMonthBoundary) {
			monthLabels.push(
				`<text x="${LABEL_SPACE_X + weekIndex * (CELL_SIZE + CELL_GAP)}" y="12" fill="${palette.mutedText}" font-size="10" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace">${MONTH_LABELS[columnDate.getUTCMonth()]}</text>`
			);
		}

		for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
			const currentDate = shiftDays(columnDate, dayIndex);
			const currentDateKey = formatDate(currentDate);
			const contribution = lookup.get(currentDateKey);
			const fill = contribution ? getCellColor(contribution.level, palette) : palette.empty;
			const title = contribution
				? `${contribution.count} contribution${contribution.count === 1 ? '' : 's'} on ${currentDateKey}`
				: `No contributions on ${currentDateKey}`;
			const x = LABEL_SPACE_X + weekIndex * (CELL_SIZE + CELL_GAP);
			const y = LABEL_SPACE_Y + dayIndex * (CELL_SIZE + CELL_GAP);

			cellRects.push(
				`<rect x="${x}" y="${y}" width="${CELL_SIZE}" height="${CELL_SIZE}" rx="2" fill="${fill}"><title>${title}</title></rect>`
			);
		}
	}

	const dayLabels = DAY_LABELS.map(
		({ row, text }) =>
			`<text x="0" y="${LABEL_SPACE_Y + row * (CELL_SIZE + CELL_GAP) + 8}" fill="${palette.mutedText}" font-size="10" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace">${text}</text>`
	).join('');

	return [
		`<svg xmlns="http://www.w3.org/2000/svg" width="${graphWidth}" height="${GRAPH_HEIGHT}" viewBox="0 0 ${graphWidth} ${GRAPH_HEIGHT}" role="img" aria-label="GitHub contribution graph">`,
		monthLabels.join(''),
		dayLabels,
		cellRects.join(''),
		'</svg>'
	].join('');
}

export const load: PageServerLoad = async () => {
	let totalContributions: number | null = null;
	let graphSvgLight: string | null = null;
	let graphSvgDark: string | null = null;

	const endDate = toUtcDate(new Date());
	const startDate = shiftDays(endDate, -364);
	const years = new Set([startDate.getUTCFullYear(), endDate.getUTCFullYear()]);
	const contributionMap = new Map<string, ContributionDay>();

	try {
		for (const year of years) {
			const response = await fetch(getContributionUrl(USERNAME, year));
			if (!response.ok) continue;

			const html = await response.text();
			for (const day of extractContributionDays(html)) {
				if (day.date >= formatDate(startDate) && day.date <= formatDate(endDate)) {
					contributionMap.set(day.date, day);
				}
			}
		}

		const days = Array.from(contributionMap.values()).sort((left, right) => left.date.localeCompare(right.date));
		if (days.length > 0) {
			totalContributions = days.reduce((sum, day) => sum + day.count, 0);
			graphSvgLight = buildGraphSvg(days, startDate, endDate, GRAPH_PALETTES.light);
			graphSvgDark = buildGraphSvg(days, startDate, endDate, GRAPH_PALETTES.dark);
		}
	} catch {
		// Keep the section renderable even if GitHub is temporarily unavailable.
	}

	return {
		githubActivity: {
			totalContributions,
			graphSvgLight,
			graphSvgDark
		}
	};
};