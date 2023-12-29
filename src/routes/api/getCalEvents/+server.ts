import { kv } from '@vercel/kv';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {

	const numRecords = Number(url.searchParams.get('numRecords'));

	try{
		const calEvents = await kv.lrange('calEvents', 0, numRecords);
		return new Response(JSON.stringify(calEvents), { status: 200 });
	} catch {
		const calEvents = [{
			date: "2020-01-20",
			timeFrom:12.00,
			timeTo:14.00,
			title: "Sample Event",
			description: "sample description",
			isPublic:true,
			location:"home",
			forIDs:["100", "200"],
			valid: true,

		},
		{
			date: "2020-01-20",
			timeFrom:16.00,
			timeTo:18.00,
			title: "Sample Event",
			description: "sample description",
			isPublic:true,
			location:"school",
			forIDs:["100", "200"],
			valid: true,

		}
	]
		return new Response(JSON.stringify([]), {status:400})
	}

}

