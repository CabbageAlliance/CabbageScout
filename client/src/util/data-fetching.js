/**
 * Fetch JSON data from this website.
 * @param {string} path Path to fetch
 * @returns The JSON body
 */
export async function json(path) {
	const res = await fetch(path);
	const json = await res.json();
	return json;
}
