export function setCookie(name, value, exdays = 30, path = "/") {
	const expiry = exdays * 24 * 60 * 60 * 1000;
	try {
		cookieStore.set({
			name: name,
			value: value,
			expires: Date.now() + expiry,
			path: path,
			partitioned: true,
		});
	} catch (error) {
		console.log(`Error setting cookie ${name}: ${error}`);
	}
}

export async function getCookie(name) {
	return await cookieStore.get(name);
}
