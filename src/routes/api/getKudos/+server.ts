import { kv } from '@vercel/kv';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {

	const numRecords = Number(url.searchParams.get('numRecords'));

	try{
		const kudos = await kv.lrange('kudos', 0, numRecords);
		return new Response(JSON.stringify(kudos), { status: 200 });
	} catch {

		return new Response(JSON.stringify([]), {status:400})
	}

}
