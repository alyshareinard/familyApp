import { kv } from '@vercel/kv';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ url }) => {

	const userRecord = Object(url.searchParams.get('userRecord'));

	try{
		const response = await kv.hset('userRecord', userRecord);
		return new Response(JSON.stringify(response), { status: 200 });
	} catch {
		
		return new Response(JSON.stringify({}), {status:400})
	}

}
