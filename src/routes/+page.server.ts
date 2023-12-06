import type { Login } from '$lib/interfaces/login';
import { tick } from 'svelte';
import { kv } from '@vercel/kv';
export async function load({ fetch }) {
	const response = await fetch('/api/getUsers', {
		method: 'GET',
		body: null,
		headers: {
			'content-type': 'application/json'
		}
	});
	const value = await response.json();
	const familyMembers = value.filter((member: Login) => member.valid == true);
	return {
		familyMembers
	};
}

async function checkPassword(password: string, userid: string) {
    console.log("in checkpassword")
	let message: string = '';
	let user: Login;
    const response = await kv.lrange('users', 0, -1);
	const value = JSON.stringify(response)
    console.log("Value is ", value)

	for (let i = 0; i < value.length; i++) {
        console.log("Single value is", value[i])
		if (value[i].id == userid) {
			user = value[i];
            console.log("just found ", user)
			break;
		}
	}
	await tick;

	if (user && password == user.password) {
		const userRecord = getUserRecord(user.id);
		message = 'Success';
		return {
			message: message,
			userRecord
		};
	} else {
		return {
			message: 'Password incorrect'
		};
	}
}

async function getUserRecord(userid: string) {
	console.log('Starting getUserRecord');
	const response = await fetch('/api/getUserRecord?userid=' + userid, {
		method: 'GET',
		body: null,
		headers: {
			'content-type': 'application/json'
		}
	});
	const value = await response.json();
	console.log('value from create is ', value);
	return value;
}

export const actions = {
	default: async ({ request }) => {
		console.log("We're in actions");

		const data = await request.formData();
		const userid = data.get('user');
		const password = data.get('password');
		console.log('user is ', userid);

		if (!userid || !password) {
			return {
				message: 'Please enter a user id and password'
			};
		} else {
			const response = await checkPassword(password, userid);

			return {
				message: response.message,
				userRecord: response.userRecord
				//userRecord
			};
		}
	}
};
