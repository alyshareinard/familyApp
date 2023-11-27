import { kv } from '@vercel/kv';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';


export const POST: RequestHandler = async ({ request }) => {

	const {date, timeFrom=null, timeTo=null, title, description=null, isPublic=true, location=null, forIds} = await request.json()
	const newCalEvent = {
        date: date,
        timeFrom: timeFrom,
        timeTo: timeTo,
        title: title,
        description: description,
        isPublic: isPublic,
        location: location,
        forIds: forIds
	};
	kv.lpush('calEvents', newCalEvent);
	return new Response (JSON.stringify(newCalEvent), { status: 200 });

}