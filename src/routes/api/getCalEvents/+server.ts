import { kv } from '@vercel/kv';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {

	const numRecords = Number(url.searchParams.get('numRecords'));

	try{
		const calEvents = await kv.lrange('calEvents', 0, numRecords);
		return new Response(JSON.stringify(calEvents), { status: 200 });
	} catch {

		return new Response(JSON.stringify([]), {status:400})
	}

}
