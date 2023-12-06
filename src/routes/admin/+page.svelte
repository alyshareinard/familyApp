<script lang="ts">
	import type { Login } from '$lib/interfaces/login';
	import type { User } from '$lib/interfaces/user';
	import { tick } from 'svelte';
	import { onMount } from 'svelte';
	let openAddUser: boolean = false;
	let openUpdateUser: boolean = false;
	let openDeleteUser: boolean = false;

	let userName: string;
	let chosenUser: string;
	let toDelete: Login;

	let isParent: boolean = false;
	let children: { id: string; name: string; }[] = [];
	let password: string;
	let familyMembers: Login[] = [];
	let userRecords: User[] = [];
	let allKids: { id: string; name: string; }[] = [];
	let message = '';
	let showUsers:boolean = false
	onMount(() => {
		getUsers();
	});
	async function getUsers() {
		showUsers=false
		const response = await fetch('/api/getUsers', {
			method: 'GET',
			body: null,
			headers: {
				'content-type': 'application/json'
			}
		});
		const value = await response.json();
		await tick();
		console.log('value is ', value);
		familyMembers = value.filter((member: Login) => member.valid == true);
		console.log('members', familyMembers)
		allKids =[]
		userRecords = []
		for (let i = 0; i < familyMembers.length; i++) {
			const tempUser = await getUserRecord(familyMembers[i].id)
			console.log("temp user", tempUser)
			userRecords.push(tempUser)
			if (tempUser.isParent == false) {
				allKids.push({ id: familyMembers[i].id, name: familyMembers[i].name });
			}
		}
		console.log("Allkids", allKids)
		console.log("familyMembers", familyMembers.length, "Users", userRecords.length)
		showUsers=true
		console.log(familyMembers.length>0 && userRecords.length>0 && userRecords.length==familyMembers.length)
	}
	async function deleteUser() {
		const userid = toDelete.id;
		if (toDelete) {
			const response = await fetch('/api/deleteUser', {
				method: 'POST',
				body: JSON.stringify({ userid }),
				headers: {
					'content-type': 'application/json'
				}
			});
			const value = await response.json();
			await tick();
			console.log('value from change is ', value);
			message = value.message;
		}
		getUsers();
		openDeleteUser = false;
	}

	async function getUserRecord(userid: string) {
		
		const response = await fetch('/api/getUserRecord?userid=' + userid, {
			method: 'GET',
			body: null,
			headers: {
				'content-type': 'application/json'
			}
		});
		const value = await response.json();
		await tick();
		console.log("user record", value)
		return(value);
		
	}

	async function updateUser(user: Login, userRecord:User) {
		//update login info first
		const userid = user.id;
		const name = user.name;
		const password = user.password;

		const response = await fetch('/api/updateUser', {
			method: 'POST',
			body: JSON.stringify({ userid, name, password}),
			headers: {
				'content-type': 'application/json'
			}
		});
		const value = await response.json();

		const response2 = await fetch('/api/updateUserRecord', {
			method: 'POST',
			body: JSON.stringify({ userid, userRecord}),
			headers: {
				'content-type': 'application/json'
			}
		});
		const value2 = await response2.json();
		await tick();
		console.log('value from change is ', value);
		message = value.message;
		const response3 = await fetch('/api/getAllowance' + '?userid='+userid+'&numRecords=20', {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
		});
		const value3 = await response3.json();
		console.log("RESPONSE FROM ALLOWANCE", value3)
		if (value3.length==0){
			const amount=userRecord.allowanceTotal
			const date = Date()
			const reason = "Initial Value"

			const response4 = await fetch('/api/addAllowanceRecord', {
			method: 'POST',
			body: JSON.stringify({ amount, date, reason, userid}),
			headers: {
				'content-type': 'application/json'
			}
		});
		}

		getUsers();
	}

	function switchAddUser() {
		openAddUser = true;
		openDeleteUser = false;
	}
	function switchDeleteUser(user: Login) {
		toDelete = user;
		openDeleteUser = true;
		openAddUser = false;
	}

	async function addUser() {
		console.log('user name is ', userName);

//		children = allKids.filter((member) => member.mychild);

		const response = await fetch('/api/addUser', {
			method: 'POST',
			body: JSON.stringify({ userName, password, isParent, children }),
			headers: {
				'content-type': 'application/json'
			}
		});
		const value = await response.json();
		await tick();
		console.log('value from change is ', value);
		message = value.message;
		getUsers();
		userName = '';
		password = '';
		isParent = false;
	
		openAddUser = false;
	}

	function updateChildren(userRecord:User, child:{ id: string; name: string; }) {
		console.log("member", userRecord)
		console.log("child", child)
		if(!userRecord.children) {
			userRecord.children = [child]
		} else if (userRecord.children.includes(child)) {
			userRecord.children = userRecord.children.filter((member:{ id: string; name: string; } ) => member != child);
		} else {
			userRecord.children.push(child)
		}
	}


	function updateChildrenOnAdd(child:{ id: string; name: string; }){
		if (children.includes(child)) {
			children = children.filter((member:{ id: string; name: string; } ) => member != child);
		} else {
			children.push(child)
		}
	}
</script>

<h1>Admin page</h1>

<button on:click={() => switchAddUser()}>Add User</button>

<br />

{#if showUsers}
	{#each familyMembers as member,i}
		<button on:click={() => updateUser(member, userRecords[i])}>Update User</button>
		<button on:click={() => switchDeleteUser(member)}>Delete User</button>

		<label> <input type="text" bind:value={member.name} /></label>
		<label>
			<input type="text" bind:value={member.password} />
		</label>
		{#if userRecords.length>i }
		<label>
			<input type="radio" bind:group={userRecords[i].isParent} value={false} />
			Child
		</label>

		<label>
			<input type="radio" bind:group={userRecords[i].isParent} value={true} />
			Parent
		</label>

		{#if userRecords[i].isParent && allKids.length>0}
		<br>
		My children: 
		{#each allKids as child}
		<label for = {child.id}>
			<input type="checkbox" 
			id={child.id}
			checked={userRecords[i].children && userRecords[i].children.some(value => value.id==child.id)} 
			on:change={() => {updateChildren(userRecords[i], child)}}
			/>
			{child.name}
		</label>
		{/each}
		<br>
		{/if}
		{#if !userRecords[i].isParent}
		<br>
		<label> Weekly Allowance
			<input type="text" bind:value={userRecords[i].weeklyAllowance} />
		</label>
		<label> Current total
			<input type="text" bind:value={userRecords[i].allowanceTotal} />
		</label>
		<br>
		{/if}
		{/if}

		<br />
	{/each}
{/if}

{#if openAddUser}
	<br />
	<h4>Add User</h4>
	<input type="text" bind:value={userName} placeholder="user name" />
	<input type="text" bind:value={password} placeholder="password" />

	<label>
		<input type="radio" bind:group={isParent} value={false} />
		Child
	</label>

	<label>
		<input type="radio" bind:group={isParent} value={true} />
		Parent
	</label>
	<br />
	{#if isParent && allKids}

	My children: 
	{#each allKids as child}
	<label for = {child.id}>
		<input type="checkbox" 
		id={child.id}
		value={child}
		checked={children.includes(child)} 
		on:change={() => {updateChildrenOnAdd(child)}}
		/>
		{child.name}
	</label>
	{/each}
	{/if}
	
	<button on:click={addUser}>Confirm</button>
{/if}

{#if openDeleteUser}
	<br />
	<h4>Delete User</h4>
	<button on:click={() => deleteUser()}>Are you sure?</button>
{/if}

<p>{message}</p>
