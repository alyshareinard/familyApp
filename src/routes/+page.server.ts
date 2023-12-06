import type { Login } from '$lib/interfaces/login';
export async function load({ fetch}){
    const response = await fetch('/api/getUsers', {
        method: 'GET',
        body: null,
        headers: {
            'content-type': 'application/json'
        }
    });
    const value = await response.json();
    const familyMembers = value.filter((member:Login) => member.valid==true);
    return{
        familyMembers
    }
}

export const actions = {
	default: async ({ locals, request }) => {
        console.log("We're in actions")

        const data = await request.formData();
        const password = data.get('password');
        console.log("userid is ", password)
        console.log("locals is ", locals)
/*
        if (password == user.password) {
			localStorage.setItem('userid', user.id);
			localStorage.setItem('userName', user.name);
			getUserRecord(user.id);
		} else {
			message = 'password incorrect';
		}*/

		return {
            message: "Success"
			//userRecord
		};
    }
}