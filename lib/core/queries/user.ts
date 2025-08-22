import type { NPMUser } from '@core/types';
import { _npm_registry_search, try_prom } from '@raw';
import npmUser from 'npm-user';

export async function npm_user(username: string): Promise<NPMUser> {
	const [user, _packages] = await Promise.all([npmUser(username), try_prom(_npm_registry_search(username, 0))]);

	return {
		username,
		name: user.name ?? null,
		avatar: user.avatar ?? null,
		contact: {
			email: user.email ?? null,
			github: user.github ?? null,
			twitter: user.twitter ?? null,
		},
		packages_count: _packages?.total ?? 0,
	};
}
