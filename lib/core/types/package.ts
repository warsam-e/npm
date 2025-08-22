import { t } from 'elysia';
import { _enum_schema } from './utils';

const _schema_url = t.String({ format: 'uri' });

const _package_typings = _enum_schema(['typescript', 'definitely_typed', 'none'], 'typescript');

const _package_version = t.Object({
	name: t.String(),
	version: t.String(),
	added_at: t.String({ format: 'date-time' }),
	repository: t.Nullable(_schema_url),
});

const _package_handler = t.Object({
	name: t.String(),
	email: t.String({ format: 'email' }),
});

const _package_stat = t.Object({
	period: _enum_schema(['day', 'week', 'month', 'year'] as const, 'day'),
	downloads: t.Number(),
	downloads_str: t.String(),
	start: t.String({ format: 'date-time' }),
	end: t.String({ format: 'date-time' }),
});

export const _npm_schema_package_partial = t.Object({
	name: t.String(),
	license: t.Nullable(t.String()),
	version: t.String(),
	keywords: t.Array(t.String()),
	description: t.String(),
	maintainers: t.Array(_package_handler),
	modified_at: t.String({ format: 'date-time' }),
});

/** @interface */
export type NPMPackagePartial = typeof _npm_schema_package_partial.static;

export const _npm_schema_packages_response = t.Object({
	info: t.Object({
		total: t.Number(),
		next: t.Nullable(t.Number()),
	}),
	list: t.Array(_npm_schema_package_partial),
});

/** @interface */
export type NPMPackagesResponse = typeof _npm_schema_packages_response.static;

export const _npm_schema_package = t.Object({
	..._npm_schema_package_partial.properties,
	typings: _package_typings,
	homepage: t.Nullable(_schema_url),
	repository: t.Nullable(_schema_url),
	bugs: t.Nullable(_schema_url),
	created_at: t.String({ format: 'date-time' }),
	contributors: t.Array(_package_handler),
	versions: t.Array(_package_version),
	stats: t.Nullable(t.Array(_package_stat)),
});

/** @interface */
export type NPMPackage = typeof _npm_schema_package.static;
