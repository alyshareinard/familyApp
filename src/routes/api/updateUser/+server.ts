import { kv } from '@vercel/kv';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Login } from '$lib/interfaces/login';
import type { User } from '$lib/interfaces/user';
import { tick } from 'svelte';
export const POST: RequestHandler = async ({ request }) => {
	const { userid, name, password } = await request.json();

	try {
		const users: Login[] = await kv.lrange('users', 0, -1);

		if (users) {
			//let users: Login[] = response;
			let userindex: number = -1;
			for (let i = 0; i < users.length; i++) {
				if (users[i].name === name && users[i].id != userid) {
					return new Response(JSON.stringify({ message: 'name already exists' }), { status: 400 });
				}
				if (users[i].id === userid) {
					userindex = i;
				}
			}
			console.log('user index: ', userindex);



			if (userindex !== -1) {
				users[userindex].name = name;
				users[userindex].password = password;

				const response2 = await kv.lset('users', userindex, JSON.stringify(users[userindex]));
				await tick();
				console.log('User changed: ', response2);
				return new Response(JSON.stringify({ message: 'User updated' }), { status: 200 });
			} else {
				return new Response(JSON.stringify({ message: 'user not found' }), { status: 400 });
			}
		}
	} catch (error) {
		console.log('houston we have a problem (in UpdateUser)');
		console.log(error);
		return new Response(JSON.stringify({ message: 'unknown issue' }), { status: 400 });
	}
};
