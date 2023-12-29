import type { Login } from '$lib/interfaces/login';
import { tick } from 'svelte';
import { kv } from '@vercel/kv';
import { redirect } from '@sveltejs/kit';

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

        const value:Login=response[i]

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
        console.log("in actions")
		const data = await request.formData();
		const userid = data.get('user');
		const password = data.get('password');
        console.log("password is ", password)


		if (!userid || !password) {
			return {
				message: 'Please enter a user id and password'
			};
		} else {
			const response = await checkPassword(password, userid);

            if (response.userRecord){
                const userRecord = response.userRecord;
                throw redirect(303, '/userpage');
            }
			return {
				message: response.message,
				userRecord: response.userRecord
				//userRecord
			};
		}
	}
};
