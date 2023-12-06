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

function checkPassword(password:string, user:Login) {
    let message:string=''
    if (password == user.password) {

        const userRecord=getUserRecord(user.id);
        message="Success";
        return({
            message:message,
            userRecord
        })
    } else {
        return({
            message:'Password incorrect'
        })
       
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
    return(value)

}


export const actions = {
	default: async ({ request }) => {
        console.log("We're in actions")

        const data = await request.formData();
        const user = data.get('user');
        const password = data.get('password');
        console.log("user is ", user);
        console.log("password is ", password)
        console.log("request is ", request)
/*
        if (password == user.password) {
			localStorage.setItem('userid', user.id);
			localStorage.setItem('userName', user.name);
			getUserRecord(user.id);
		} else {
			message = 'password incorrect';
		}*/

		return {
            message: "Success",
  
			//userRecord
		};
    }
}