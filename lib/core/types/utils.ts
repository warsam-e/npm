import { t } from 'elysia';

export const _enum_schema = <T extends string>(values: T[], example: T, default_value?: T) =>
	t.Enum(Object.fromEntries(values.map((v) => [v, v])), { examples: [example], default: default_value });
