import { kv } from '@vercel/kv';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Login } from '$lib/interfaces/login';
import type { User } from '$lib/interfaces/user';
import { tick } from 'svelte';
export const POST: RequestHandler = async ({ request }) => {
	const { userid, newName } = await request.json();

	try {
		const users = await kv.get('users');
		
		if ( users ) {
			//let users: Login[] = response;
            let userindex: number = -1
			for (let i = 0; i < users.length; i++) {
                if (users[i].name === newName) {
                    return new Response(JSON.stringify({message:"name already exists"}), { status: 400 });
                }
				if (users[i].id === userid){
                        userindex = i;
                }
			}
            console.log("user index: ", userindex)
            if (userindex !== -1) {
                
                users[userindex].name = newName;
            } else {
                return new Response(JSON.stringify({message:"user not found"}), { status: 400 });
            }
            console.log("userid", userid)
            const userRecord: User = await kv.get(userid);
            console.log("user record: ", userRecord)
            //check to see if userRecord contains the key 'name'
            if (!userRecord) {
                return new Response(JSON.stringify({message:"user not found"}), { status: 400 });
            } else if (!('name' in userRecord)) {
                return new Response(JSON.stringify({message:"corrupt user -- does not contain 'name'"}), { status: 400 });
            }
            userRecord.name=newName;
            const response = await kv.set(userid, userRecord);
            console.log("response: ", response)
			const response2 = await kv.set('users', JSON.stringify(users));
            await tick()
            console.log("Name changed: ", response2)
			return new Response(JSON.stringify({message:"Name changed"}), { status: 200 });
		}
	} catch(error) {
        console.log("houston we have a problem (in UpdateUserPassword)")
        console.log(error)
		return new Response(JSON.stringify({}), { status: 400 });
	}
};
