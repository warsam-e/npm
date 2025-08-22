import type { NPMPackagePartial, NPMPackagesResponse } from '@core/types';
import { _npm_registry_search } from '@raw';

export const npm_packages = (username: string, offset = 0): Promise<NPMPackagesResponse> =>
	npm_search(`author:${username}`, offset);

export async function npm_search(text: string, offset = 0): Promise<NPMPackagesResponse> {
	const res = await _npm_registry_search(text, offset);

	const next = res.total > offset + res.objects.length ? offset + res.objects.length : null;

	const list = res.objects.map<NPMPackagePartial>((p) => ({
		name: p.package.name,
		version: p.package.version,
		license: p.package.license ?? null,
		keywords: p.package.keywords,
		description: p.package.description ?? null,
		maintainers: p.package.maintainers.map((m) => ({
			name: m.username,
			email: m.email,
		})),
		modified_at: p.package.date,
	}));

	return {
		info: {
			total: res.total,
			next,
		},
		list,
	};
}
