import { kv } from '@vercel/kv';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { moodHist } from "$lib/interfaces/moodHist";
export const GET: RequestHandler = async ({ url }) => {

	const numRecords = Number(url.searchParams.get('numRecords'));
	const userid = url.searchParams.get('userid')
	const moodid = "mood:" + userid
	console.log("mood id is ", moodid)
	try{
		const moodHistory = await kv.lrange(moodid, 0, numRecords);
		return new Response(JSON.stringify(moodHistory), { status: 200 });
	} catch {

		return new Response(JSON.stringify([]), {status:400})
	}

}
