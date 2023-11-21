import { kv } from '@vercel/kv';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {

	try {
		const response = await kv.get('users');
		if (response) {
			let users = response;

			return new Response(JSON.stringify(users), { status: 200 });

		} else {
			throw error;
		}
	} catch {
		const users:[] = [];
		return new Response(JSON.stringify(users), { status: 400 });
	}
};
