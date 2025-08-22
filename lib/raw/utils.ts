export async function get_json<T>(url: string, opts?: RequestInit): Promise<T> {
	const res = await fetch(url, opts);
	if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);

	return res.json() as Promise<T>;
}

export async function try_prom<T>(prom: Promise<T> | T): Promise<T | undefined> {
	try {
		return await prom;
	} catch {}
	return;
}
