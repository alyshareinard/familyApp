import { kv } from '@vercel/kv';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Login } from '$lib/interfaces/login';
export const POST: RequestHandler = async ({ request }) => {
	const { userid, currentPassword, newPassword } = await request.json();

	try {
		const response = await kv.get('users');
		
		if (response ) {
			let users: Login[] = response;
			for (let i = 0; i < users.length; i++) {
				if (users[i].id === userid){
                    if (users[i].password !== currentPassword) {
                        return new Response(JSON.stringify({message:"current password incorrect"}), { status: 400 });
                    } else {
                        users[i].password = newPassword;
                    }
                }
			}
         
			const response2 = await kv.set('users', JSON.stringify(users));
            console.log("password changed: ", response2)
			return new Response(JSON.stringify({message:"password changed"}), { status: 200 });
		}
	} catch {
        console.log("houston we have a problem (in UpdateUserPassword)")
		return new Response(JSON.stringify({}), { status: 400 });
	}
};
