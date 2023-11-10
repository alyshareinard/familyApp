import { kv } from '@vercel/kv';

export async function load() {
	const moodHistory = await kv.get<[]>('moodHistory');
	await kv.set('moodHistory', moodHistory || []);
	const updatedMoodHistory = await kv.get('moodHistory');
	return {
		moodHistory: updatedMoodHistory
	};
}

/*
export const actions = {
    addMoodRecord: async ({ request }) => {
        const data = await request.formData();
        const moodRecord = data.get('moodRecord');
        await kv.lpush('moodHistory', moodRecord);
        return {
            success: true
        }
    }
}*/
