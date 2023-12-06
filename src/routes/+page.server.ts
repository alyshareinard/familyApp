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

    console.log("Value is ", response)

	for (let i = 0; i < response.length; i++) {
        console.log("Single response is", response[i])
        const value=response[i]
        console.log("Single value is", value)
		if (value.id == userid) {
			user = value;
            console.log("just found ", user)
			break;
		}
	}
	await tick;

	if (user && password == user.password) {
        const userRecord = await kv.get(user.id);
        console.log("user record is ", userRecord)
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
