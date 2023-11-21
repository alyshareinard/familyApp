import { kv } from '@vercel/kv';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { Login } from "$lib/interfaces/login";


export const POST: RequestHandler = async ({ url }) => {

    const users:Login[] = [
        {
        id:"01020304",
        name:"Mommy",
        password:"abc123",
        loginRewards:[],
        kid:false
    },
    {
        id:"12345022",
        name:"Maman",
        password:"password",
        loginRewards:[],
        kid:false
    },
    {
        id:"13010301",
        name:"Josh",
        password:"password",
        loginRewards:[],
        kid:true
    },
    {
        id:"04030129",
        name:"Xavi",
        password:"password",
        loginRewards:[],
        kid:true
    },
    ]

	try{


		const response = await kv.set('users', users);
        console.log("CREATE USERS RESPONSE", response)
        for (let i=0; i<users.length; i++){
            const response = await kv.set(users[i].id, {points:0, name:users[i].name, kid:users[i].kid, allowanceTotal:0, rewards:[], options:[]})
            await kv.del("mood:"+users[i].id)
            await kv.del("allowance:"+users[i].id)
            await kv.del("rewards:"+users[i].id)
//            const moodresponse = await kv.lpush("mood:"+users[i].id, {"moodValue":0, "date":"", "valid":false, "notes":""})
//            const allowanceresponse = await kv.lpush("allowance:"+users[i].id, {"amount":0, "date":"", "reason":""})
//            const rewardresponse = await kv.lpush("rewards:"+users[i].id, {"rewardName":0, "dateEarned":"", "pointValue":"", active:false})
            console.log("CREATE USER RECORD RESPONSE", response)
//            console.log("CREATE USER mood RESPONSE", moodresponse)
//            console.log("CREATE USER allowance RESPONSE", allowanceresponse)
//            console.log("CREATE USER reward RESPONSE", rewardresponse)
        }

        

		return new Response(JSON.stringify("success"), { status: 200 });
	} catch {
		
		return new Response(JSON.stringify({}), {status:400})
	}

}
