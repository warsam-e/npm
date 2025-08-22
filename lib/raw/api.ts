import { get_json } from './utils';

const periods = ['last-day', 'last-week', 'last-month', 'last-year'] as const;
type NPMStatsPeriod = (typeof periods)[number];

type NPMStatsResponse = { downloads: number; start: string; end: string; package: string };

const _raw_stats = (name: string, period: NPMStatsPeriod) =>
	get_json<NPMStatsResponse>(`https://api.npmjs.org/downloads/point/${period}/${name}`);

export async function _npm_download_stats(name: string): Promise<
	Array<
		NPMStatsResponse & {
			period: 'day' | 'week' | 'month' | 'year';
		}
	>
> {
	const [day, week, month, year] = await Promise.all(periods.map((period) => _raw_stats(name, period)));
	return [
		{ period: 'day', ...day },
		{ period: 'week', ...week },
		{ period: 'month', ...month },
		{ period: 'year', ...year },
	];
}
