import { kv } from '@vercel/kv';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Login } from '$lib/interfaces/login';
export const POST: RequestHandler = async ({ request }) => {
	const { userid } = await request.json();

	try {
		const users: Login[] = await kv.lrange('users', 0, -1);
		let index: number = -1;
        console.log("looking for ", userid)
		if (users) {
			for (let i = 0; i < users.length; i++) {
                console.log("users[i]", users[i])
				if (users[i].id == userid) {
					index = i;
					users[i].valid = false;
				}
			}
		}

		console.log('index is ', index);
		if (index >= 0) {
			const response2 = await kv.lset('users', index, JSON.stringify(users[index]));

			return new Response(JSON.stringify({ message: 'user deleted' }), { status: 200 });
		}
	} catch {
		console.log('houston we have a problem (in UpdateUserPassword)');
		return new Response(JSON.stringify({}), { status: 400 });
	}
};
