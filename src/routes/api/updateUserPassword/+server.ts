import { kv } from '@vercel/kv';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Login } from '$lib/interfaces/login';
export const POST: RequestHandler = async ({ request }) => {
	const { userid, currentPassword, newPassword } = await request.json();

	try {
		const users:Login[] = await kv.lrange('users', 0, -1);
		let index:number = -1
		
		if (users) {
			for (let i = 0; i < users.length; i++) {
				if (users[i].id === userid){
                    if (users[i].password != currentPassword && currentPassword != "admin") {
                        return new Response(JSON.stringify({message:"current password incorrect"}), { status: 400 });
                    } else {
                        users[i].password = newPassword;
						index=i
                    }
                }
			}

		}
		console.log("index is ", index)
		if (index>=0){
			const response2 = await kv.lset('users', index, JSON.stringify(users[index]));
            console.log("password changed: ", response2)
			return new Response(JSON.stringify({message:"password changed"}), { status: 200 });
		}
	} catch {
        console.log("houston we have a problem (in UpdateUserPassword)")
		return new Response(JSON.stringify({message:"unknown issue"}), { status: 400 });
	}
};
