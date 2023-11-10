import { kv } from '@vercel/kv';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

function getDateTime(date: Date = new Date()) {
	const dayOfMonth = date.getDate();
	const month = date.getMonth(); // Be careful! January is 0, not 1
	const year = date.getFullYear();

	const dateString = dayOfMonth + '.' + (month + 1) + '.' + year;
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let ampm = hours >= 12 ? 'pm' : 'am';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	let strminutes = minutes < 10 ? '0' + minutes : minutes;
	let strTime = hours + ':' + strminutes + ' ' + ampm;
	return dateString + ' ' + strTime;
}
export const POST: RequestHandler = async ({ request }) => {

	const {mood, valid} = await request.json()
	const newMoodRecord = {
		mood: Number(mood),
		date: getDateTime(new Date()),
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
