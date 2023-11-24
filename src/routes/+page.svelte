<script lang="ts">
	import type { Login } from '$lib/interfaces/login';

	import { tick } from 'svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { userRecord } from '$lib/stores/UserStore';

	let familyMembers: Login[];
	onMount(async () => {
		//await createUsers()
		//await tick()
		getUsers();
	});

	async function createUsers() {
		console.log('Starting createUsers');
		const response = await fetch('/api/createUsers', {
			method: 'POST',
			body: null,
			headers: {
				'content-type': 'application/json'
			}
		});
		const value = await response.json();
		await tick();
		console.log('value from create is ', value);
	}

	async function getUsers() {
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
		familyMembers = await value;
	}

	let user: Login;
	let password: string = '';
	let message = '';
	function assignUser(member: Login) {
		message = '';
		user = member;
	}
	function checkPassword() {
		if (password == user.password) {
			localStorage.setItem('userid', user.id);
			getUserRecord(user.id);
		} else {
			message = 'password incorrect';
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
		await tick();
		console.log('value from create is ', value);
		userRecord.set(value);
		goto('/userpage');
	}
</script>

<h1>Welcome to the Family App</h1>

<p>Click your name to login</p>
<div class="familyContainer">
	{#if familyMembers}
		{#each familyMembers as member}
			<button class="nameButton" on:click={() => assignUser(member)}>{member.name}</button>
			{#if user == member}
				<input bind:value={password} placeholder="password" />

				<button on:click={() => checkPassword()}> login </button>
				{#if message}
					{message}
				{/if}
			{/if}
		{/each}
	{/if}
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
