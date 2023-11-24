import { kv } from '@vercel/kv';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {

    const { users } = await request.json()


	try{
		const response = await kv.hset('users', users);
		return new Response(JSON.stringify(response), { status: 200 });
	} catch {
		
		return new Response(JSON.stringify({}), {status:400})
	}

}
