import { kv } from '@vercel/kv';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Login } from '$lib/interfaces/login';
import type { User } from '$lib/interfaces/user';

export const POST: RequestHandler = async ({ request }) => {
	const { userName, password, isParent, children } = await request.json();
    console.log("name is ", userName)
	function getUserId() {
		return Math.floor(Math.random() * 10000000 + 1);
	}
	let userID = getUserId();
	//check that userID isn't already used
	//check that name isn't already used
	const existingUsers: Login[] = (await kv.lrange('users', 0, -1)) || [];
	console.log('existingUsers ', existingUsers);
	if (existingUsers) {
		let isUserIDUsed = existingUsers.some((user) => user.id === String(userID));
		while (isUserIDUsed) {
			userID = getUserId();
			isUserIDUsed = existingUsers.some((user) => user.id === String(userID));
		}

		const isNameUsed = existingUsers.some((user) => user.name === userName);
		if (isNameUsed) {
			return new Response(JSON.stringify({ message: 'name already used' }), { status: 400 });
		}
	}

	let user: Login = {
		id: String(userID),
		name: userName,
		password: password,
		loginRewards: [],
		valid: true
	};

	console.log('adding user ', user);

	try {
		let userRecord: User = {
			points: 0,
			isParent: isParent,
			children: children,
			allowanceTotal: 0,
			weeklyAllowance: 0,
			rewards: [],
			options: []
		}
		const response = await kv.lpush('users', user);
		const response2 = await kv.set(user.id, userRecord);

		return new Response(JSON.stringify({ message: 'Success! User ' + user.name + ' added.' }), {
			status: 200
		});
	} catch {
		return new Response(JSON.stringify({}), { status: 400 });
	}
};
