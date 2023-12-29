import { kv } from '@vercel/kv';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { User } from '$lib/interfaces/user';


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
	console.log("for userid ", userid)
	
	const response = await kv.get(userid);
	const userRecord:User = response 
	userRecord.allowanceTotal = userRecord.allowanceTotal + amount
	kv.lpush('allowance:'+userid, newAllowanceRecord);
	kv.set(userid, userRecord);
	return new Response (JSON.stringify(newAllowanceRecord), { status: 200 });


}