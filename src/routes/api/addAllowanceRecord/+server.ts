import { kv } from '@vercel/kv';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';


export const POST: RequestHandler = async ({ request }) => {

	const {amount, date, reason, userid} = await request.json()
	const newAllowanceRecord = {
        amount: amount,
        date: date,
        reason: reason,
		valid: true,
		approved: false
	};
	console.log("adding allowance record", newAllowanceRecord)
	kv.lpush('allowance:'+userid, newAllowanceRecord);
	return new Response (JSON.stringify(newAllowanceRecord), { status: 200 });


}