import type { NPMPackage } from '@core/types';
import { _npm_download_stats, _npm_registry_package, try_prom, type NPMRegistryResponse } from '@raw';

async function _definitely_typed_exists(_name: string): Promise<boolean> {
	const name = `@types/${_name}`;
	let res: Awaited<ReturnType<typeof _npm_registry_package>>;
	try {
		res = await _npm_registry_package(name);
	} catch {
		return false;
	}
	return res.name === name;
}

const _format_version = ({
	raw,
	time,
}: {
	raw: NPMRegistryResponse['versions'][string];
	time: NPMRegistryResponse['time'];
}): NPMPackage['versions'][number] => ({
	name: raw.name,
	version: raw.version,
	added_at: time[raw.version],
	repository: _format_repo(raw.repository),
});

function _format_repo(repo: NPMRegistryResponse['repository']) {
	if (!repo?.url) return null;
	let orig: URL;
	try {
		orig = new URL(repo.url);
	} catch {
		return null;
	}
	const url = new URL('https://github.com');
	url.pathname = orig.pathname.replace(/\.git$/, '');
	return url.toString();
}

const _format_handler = (
	maintainer: NPMRegistryResponse['maintainers'][number],
): NPMPackage['maintainers'][number] => ({
	name: maintainer.name,
	email: maintainer.email,
});

function url_or_null(url?: string) {
	if (!url) return null;
	try {
		return new URL(url).toString();
	} catch {}
	return null;
}

export async function npm_package(name: string): Promise<NPMPackage> {
	const raw = await try_prom(_npm_registry_package(name));
	if (!raw) throw new Error('Failed to fetch package info');

	const latest_version = raw['dist-tags']?.latest;
	if (!latest_version) throw new Error('Package unavailable. Likely unpublished.');
	const latest = raw.versions[latest_version];
	if (!latest) throw new Error('Package is missing latest version, somehow.');

	let typings: NPMPackage['typings'] = 'none';
	if (latest.types) typings = 'typescript';
	else if (await _definitely_typed_exists(name)) typings = 'definitely_typed';

	const _stats = await try_prom(_npm_download_stats(name));
	const stats =
		_stats?.map<NonNullable<NPMPackage['stats']>[number]>((s) => ({
			period: s.period,
			downloads: s.downloads,
			downloads_str: s.downloads.toLocaleString(),
			start: new Date(s.start).toISOString(),
			end: new Date(s.end).toISOString(),
		})) ?? null;

	return {
		name: raw.name,
		license: raw.license ?? null,
		version: latest.version,
		typings,
		description: latest.description ?? null,
		keywords: latest.keywords ?? [],
		homepage: url_or_null(latest.homepage),
		repository: _format_repo(latest.repository),
		bugs: latest.bugs?.url ?? null,
		created_at: raw.time.created,
		modified_at: raw.time.modified,
		maintainers: raw.maintainers.map(_format_handler),
		contributors: raw.contributors?.map(_format_handler) ?? [],
		versions: Object.values(raw.versions)
			.map((k) => ({
				raw: k,
				time: raw.time,
			}))
			.map(_format_version),
		stats,
	};
}
