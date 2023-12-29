<script lang="ts">
	import type { Login } from '$lib/interfaces/login';

	import { tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { userRecord } from '$lib/stores/UserStore';
	import { enhance } from '$app/forms';
	export let form;
	export let data;
	const familyMembers: Login[] = data.familyMembers;

	let user: Login;
	let password: string = '';
	let message = '';
	function assignUser(member: Login) {
		message = '';
		user = member;
	}

	//for $: you can wrap in parenthesis to avoid a warning
	/*
	function checkPassword() {
		if (password == user.password) {
			localStorage.setItem('userid', user.id);
			localStorage.setItem('userName', user.name);
			getUserRecord(user.id);
		} else {
			message = 'password incorrect';
		}
	}*/

	/*
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
		await tick();
		console.log('value from create is ', value);
		userRecord.set(value);
		goto('/userpage');
	}*/
</script>

<h1>Welcome to the Family App</h1>

<p>Click your name to login</p>
<div class="familyContainer">
	<form method="POST" use:enhance={({formData}) => {
        formData.append('user', user.id);

    }}>
	{#if familyMembers}
		<div class="memberContainer">
		{#each familyMembers as member}
			<button class="nameButton" name="user" id="user" value=member.id on:click={() => assignUser(member)}>{member.name}</button>
			{#if user == member}
			<input type="text" required name="password" id="password" />

			<button type="submit"> login </button>
				{#if form?.message}
					{form.message}
					<br>

				{/if}
			{/if}
		{/each}
	</div>
	{/if}
</form>
</div>





<style>
	.familyContainer {
		display: flex;
		flex-direction:column;
	}
	.memberContainer {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		column-gap: 5px;
		row-gap: 10px;
	}
	.nameButton {
		grid-column-start: 1;
	}
</style>
