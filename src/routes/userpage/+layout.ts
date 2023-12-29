

import { kv } from '@vercel/kv';
import { redirect } from '@sveltejs/kit';

export async function load({ fetch, params, parent }) {
    const parent_data = await parent();
    console.log("params in userpage", params)
    console.log("parent in userpage", parent_data)

    const userid='475625'
    const response = await kv.get(userid);
    if (response) {
        let userRecord = response;
        return({
            userRecord: userRecord
        })
        //return new Response(JSON.stringify(userRecord), { status: 200 });

    } else {
        throw redirect(303, '/');
    }


}