export function setCookie(name, value, exdays) {
	const expiry = (exdays || 30) * 24 * 60 * 60 * 1000;
	cookieStore.set({
		name: name,
		value: value,
		expires: Date.now() + expiry,
		path: "/",
	});
}

export async function getCookie(name) {
	const cookie = await cookieStore.get(name);
	return cookie;
}
