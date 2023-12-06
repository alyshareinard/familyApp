import { kv } from '@vercel/kv';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';


export const POST: RequestHandler = async ({ request }) => {

	const {mood, date, valid, notes, userid} = await request.json()
	console.log("in addmoodrecodd date is ", date, mood)
	const newMoodRecord = {
		moodValue: Number(mood),
		date: date,
		notes: notes,
		valid: valid
	};
	kv.lpush('mood:'+userid, newMoodRecord);
	return new Response (JSON.stringify(newMoodRecord), { status: 200 });


}