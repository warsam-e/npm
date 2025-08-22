import { Value } from '@sinclair/typebox/value';
import { expect, setDefaultTimeout, test } from 'bun:test';
import type { Static, TSchema } from 'elysia';
import {
	_npm_schema_package,
	_npm_schema_package_partial,
	_npm_schema_packages_response,
	npm_package,
	npm_packages,
	npm_search,
	npm_user,
	type NPMPackage,
	type NPMPackagePartial,
	type NPMPackagesResponse,
} from './core';

setDefaultTimeout(10000000);

function _check_schema<T extends TSchema>(data: Static<T>, schema: T) {
	let val = false;
	try {
		Value.Decode(schema, data);
		val = true;
	} catch {
		console.log([...Value.Errors(schema, data)].map((e) => [...e.errors].flatMap((e) => [...e])));
	}
	return expect(val).toBe(true);
}

function check_package_partial(data: NPMPackagePartial) {
	expect(data).toBeObject();
	expect(data.name).toBeString();
	expect(data.license).toBeOneOf([null, expect.any(String)]);
	expect(data.version).toBeString();
	expect(data.keywords).toBeArray();
	for (const kw of data.keywords) expect(kw).toBeString();
	expect(data.description).toBeOneOf([null, expect.any(String)]);
	expect(data.maintainers).toBeArray();
	for (const m of data.maintainers) {
		expect(m).toBeObject();
		expect(m.name).toBeString();
		expect(m.email).toBeString();
	}
	expect(data.modified_at).toBeString();
	_check_schema(data, _npm_schema_package_partial);
}

function check_package(data: NPMPackage) {
	check_package_partial(data);
	if (data.stats) {
		expect(data.stats).toBeArray();
		for (const stat of data.stats) {
			expect(stat).toBeObject();
			expect(stat.downloads).toBeNumber();
			expect(stat.period).toBeOneOf(['day', 'week', 'month', 'year']);
			expect(stat.start).toBeString();
			expect(stat.end).toBeString();
		}
	}
	expect(data.versions).toBeArray();
	for (const version of data.versions) {
		expect(version).toBeObject();
		expect(version.name).toBeString();
		expect(version.version).toBeString();
		expect(version.added_at).toBeString();
		expect(version.repository).toBeOneOf([null, expect.any(String)]);
	}
	_check_schema(data, _npm_schema_package);
}

function check_packages_response(data: NPMPackagesResponse) {
	expect(data).toBeObject();
	expect(data.info).toBeObject();
	expect(data.info.total).toBeNumber();
	expect(data.info.next).toBeOneOf([null, expect.any(Number)]);
	expect(data.list).toBeArray();
	for (const pkg of data.list) check_package_partial(pkg);
	_check_schema(data, _npm_schema_packages_response);
}

test('search:packages', async () => {
	const res = await npm_search('express');
	check_packages_response(res);
});

test('package:info', async () => {
	const info = await npm_package('aniql');
	check_package(info);
});

test('user:info', async () => {
	const res = await npm_user('warsam-e');
	expect(res).toBeObject();
	expect(res.username).toBe('warsam-e');
	expect(res.packages_count).toBeNumber();
	expect(res.packages_count).toBeGreaterThan(0);
});

test('user:packages', async () => {
	const res = await npm_packages('warsam-e');
	check_packages_response(res);
});
