import { get_json } from './utils';

export const _npm_registry_search = (text: string, offset: number) =>
	get_json<{
		objects: Array<{
			downloads: Array<{ monthly: number; weekly: number }>;
			dependents: string;
			updated: string;
			searchScore: number;
			package: {
				name: string;
				keywords: string[];
				version: string;
				description?: string;
				sanitized_name: string;
				publisher: { email: string; username: string; actor?: { name: string; type: string; email: string } };
				maintainers: Array<{ email: string; username: string }>;
				license?: string;
				date: string;
				links: { homepage: string; repository: string; npm: string };
			};
			score: { final: string; detail: Record<'popularity' | 'quality' | 'maintenance', number> };
			flags: { insecure: number };
		}>;
		total: number;
		time: string;
	}>(`https://registry.npmjs.org/-/v1/search?text=${text}&size=100&from=${offset}`);

export const _npm_registry_package = (name: string) =>
	get_json<NPMRegistryResponse>(`https://registry.npmjs.org/${name}`);

export interface NPMRegistryResponse {
	_id: string;
	_rev: string;
	name: string;
	'dist-tags': DistTags;
	versions: Record<string, Version>;
	time: Time;
	bugs?: Record<'url', string>;
	license?: string;
	homepage: string;
	keywords: Array<string>;
	repository?: { type: string; url?: string };
	description: string;
	contributors?: Array<Handler>;
	maintainers: Array<Handler>;
	readme: string;
	readmeFilename: string;
}

interface DistTags {
	latest: string;
	[tag: string]: string;
}

interface Version {
	name: string;
	version: string;
	keywords: Array<string>;
	license: string;
	_id: string;
	maintainers: Array<Handler>;
	homepage?: string;
	bugs?: Record<'url', string>;
	dist: Dist;
	main: string;
	type: string;
	types: string;
	exports: Record<string, unknown>;
	gitHead: string;
	scripts: Record<string, string>;
	_npmUser: Record<'name' | 'email', string>;
	repository?: Record<'type' | 'url', string>;
	_npmVersion: string;
	description?: string;
	directories: Record<string, unknown>;
	_nodeVersion: string;
	_hasShrinkwrap: boolean;
	devDependencies: Record<string, string>;
	peerDependencies: Record<string, string>;
	optionalDependencies: Record<string, string>;
	dependencies: Record<string, string>;
	module?: string;
}

interface Handler {
	name: string;
	email: string;
}

interface Dist {
	shasum: string;
	tarball: string;
	fileCount: number;
	integrity: string;
	signatures: Array<{ sig: string; keyid: string }>;
	unpackedSize: number;
}

interface Time {
	created: string;
	modified: string;
	[version: string]: string;
}
