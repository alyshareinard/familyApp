import { kv } from '@vercel/kv';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const userId = String(url.searchParams.get('userid'));

	try {
		const response = await kv.get(userId);
		if (response) {
			let userRecord = response;

			return new Response(JSON.stringify(userRecord), { status: 200 });

		} else {
			throw error;
		}
	} catch {
		const userRecord: {} = {};
		return new Response(JSON.stringify(userRecord), { status: 400 });
	}
};
