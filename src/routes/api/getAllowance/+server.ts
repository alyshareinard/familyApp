import { kv } from '@vercel/kv';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {

	const numRecords = Number(url.searchParams.get('numRecords')) || 20;
	const userid = url.searchParams.get('userid')
	const allowanceid = "allowance:" + userid
	console.log("getting ", allowanceid)
	try{
		const allowanceHist = await kv.lrange(allowanceid, 0, numRecords);
		return new Response(JSON.stringify(allowanceHist), { status: 200 });
	} catch {

		return new Response(JSON.stringify([]), {status:400})
	}

}
