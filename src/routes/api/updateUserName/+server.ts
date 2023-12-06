import { kv } from '@vercel/kv';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Login } from '$lib/interfaces/login';
import type { User } from '$lib/interfaces/user';
import { tick } from 'svelte';
export const POST: RequestHandler = async ({ request }) => {
	const { userid, newName } = await request.json();

	try {
		const users:Login[] = await kv.lrange('users', 0, -1);
		
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
            const tempRecord: any = await kv.get(userid);
            console.log("user record: ", tempRecord)
            //check to see if userRecord contains the key 'name'
            if (!tempRecord) {
                return new Response(JSON.stringify({message:"user not found"}), { status: 400 });
            } else if (!('name' in tempRecord)) {
                return new Response(JSON.stringify({message:"corrupt user -- does not contain 'name'"}), { status: 400 });
            }
            console.log("userindex is ", userindex)
            tempRecord.name=newName;
            const response = await kv.set(userid, tempRecord);
            console.log("response: ", response)
			const response2 = await kv.lset('users', userindex, JSON.stringify(users[userindex]));
            await tick()
            console.log("Name changed: ", response2)
			return new Response(JSON.stringify({message:"Name changed"}), { status: 200 });
		}
	} catch(error) {
        console.log("houston we have a problem (in UpdateUserPassword)")
        console.log(error)
		return new Response(JSON.stringify({message:"unknown issue"}), { status: 400 });
	}
};
