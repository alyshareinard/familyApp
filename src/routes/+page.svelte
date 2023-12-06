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
	<form use:enhance method="POST">
	{#if familyMembers}
		{#each familyMembers as member}
			<button class="nameButton" on:click={() => assignUser(member)}>{member.name}</button>
			{#if user == member}
			<input type="text" required name="password" id="password" />

			<button> login </button>
				{#if form?.message}
					{form.message}
					<br>
					locals
					{form.locals}
					<br>
					request
					{form.request}
				{/if}
			{/if}
		{/each}
	{/if}
</form>
</div>





<style>
	.familyContainer {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		column-gap: 5px;
		row-gap: 10px;
	}
	.nameButton {
		grid-column-start: 1;
	}
</style>
