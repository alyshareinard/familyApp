import { kv } from '@vercel/kv';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';


export const POST: RequestHandler = async ({ request }) => {

	const {date, fromid, toid, isPublic, reason} = await request.json()
	const newKudo = {
        date: date,
        fromid: fromid,
        toid: toid,
        isPublic: isPublic,
        reason: reason,
	};
	kv.lpush('kudos', newKudo);
	return new Response (JSON.stringify(newKudo), { status: 200 });


}

