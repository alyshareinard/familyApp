import { kv } from '@vercel/kv';

export const actions = {
	default: async ({ request }) => {

		console.log("in default")
		const data = await request.formData();
		const amount = data.get('amount');
		const date = data.get('date');
		const reason = data.get('reason');
		const userid = data.get('user');
		const approved = data.get('approved') || false;
		const valid = data.get('valid') || true;


		if (!userid || !amount) {
			return {
				message: 'Please enter an amount'
			};
		} else {
			const newAllowanceRecord = {
				amount: amount,
				date: date,
				reason: reason,
				valid: valid,
				approved: approved
			}

			kv.lpush('allowance:'+userid, newAllowanceRecord);
			return new Response (JSON.stringify(newAllowanceRecord), { status: 200 });

		}
	}
}