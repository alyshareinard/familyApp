import { kv } from '@vercel/kv';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	const { userid, userRecord } = await request.json();
	console.log("updating", userid, userRecord)

	try{
		const response = await kv.set(userid, userRecord);
		return new Response(JSON.stringify(response), { status: 200 });
	} catch {
		
		return new Response(JSON.stringify({}), {status:400})
	}

}
