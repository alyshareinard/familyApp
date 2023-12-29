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
		const allowanceHist = [{
			amount: 102,
			date: "2020-01-05",
			reason: "starting amount",
			valid: true,
			approved:true
		},
		{
			amount: 12,
			date: "2020-01-12",
			reason: "allowance",
			valid: true,
			approved:true
		}
	]
		return new Response(JSON.stringify(allowanceHist), {status:400})
	}

}
