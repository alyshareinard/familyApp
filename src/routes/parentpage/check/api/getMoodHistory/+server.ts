import { kv } from '@vercel/kv';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {

	const numRecords = Number(url.searchParams.get('numRecords'));

	const moodHistory = await kv.lrange('myMoodHistory', 0, numRecords);
	return new Response(JSON.stringify(moodHistory), { status: 200 });


}
