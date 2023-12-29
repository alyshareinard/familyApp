import { kv } from '@vercel/kv';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const userId = String(url.searchParams.get('userid'));
	console.log("getting user record for ", userId)
	try {
		const response = await kv.get(userId);
		if (response) {
			let userRecord = response;

			return new Response(JSON.stringify(userRecord), { status: 200 });

		} else {
			throw error;
		}
	} catch {
		const userRecord = {
			allowanceTotal: 0,
			rewards: [{
				rewardName: "darkMode",
				dateEarned: "2022-03-04",
			}], //rewards
			options: [{
				optionName: "darkMode",
				optionValue: true,
			}], //options
			points: 206,
			isParent: false,
			weeklyAllowance:10,
			children: [],
			valid:true,
		} //user
		
		return new Response(JSON.stringify(userRecord), { status: 400 });
	}
};
