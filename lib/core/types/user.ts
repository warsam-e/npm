import { t } from 'elysia';
import { _enum_schema } from './utils';

export const _npm_schema_user = t.Object({
	name: t.Nullable(t.String()),
	username: t.String(),
	avatar: t.Nullable(t.String()),
	packages_count: t.Number(),
	contact: t.Record(_enum_schema(['email', 'github', 'twitter'] as const, 'email'), t.Nullable(t.String())),
});

/** @interface */
export type NPMUser = typeof _npm_schema_user.static;
