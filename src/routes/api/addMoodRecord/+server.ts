import { kv } from '@vercel/kv';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {

	const {mood, valid} = await request.json()
	const newMoodRecord = {
		mood: Number(mood),
		date: new Date().toISOString(),
		valid: valid
	};
	kv.lpush('myMoodHistory', newMoodRecord);
	return new Response (JSON.stringify(newMoodRecord), { status: 200 });


}
/*	
export default async function handler(request: VercelRequest, response: VercelResponse) {
	const moodHistory = await kv.hgetall('moodHistory');
	return response.status(200).json(moodHistory);
}
async function addMoodRecord(newMoodRecord: { mood: number; date: string; valid: boolean }) {
	console.log('pushing to kv');
	await kv.lpush('myMoodHistory', newMoodRecord);
	return {
		success: true
	};
}*/
