<script lang="ts">
	import { tick } from 'svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let message: string = '';
	let openChangePassword: boolean = false;
    let openChangeName: boolean = false;

	let currentPassword: string;
	let newPassword: string;
	let userid: string;
    let newName: string;

    let allowNameChange: boolean = true;

	onMount(async () => {
		userid = localStorage.getItem('userid') || '';
		if (userid == '') {
			goto('/');
		} 
	});

	async function changePassword() {
		console.log('changing password');
        if (currentPassword == '' || newPassword == '' || currentPassword == null || newPassword == null) {
            message = 'Please enter your current and new password';
        } else {


		const response = await fetch('/api/updateUserPassword', {
			method: 'POST',
			body: JSON.stringify({ userid, currentPassword, newPassword }),
			headers: {
				'content-type': 'application/json'
			}
		});
		const value = await response.json();
		await tick();
		console.log('value from change is ', value);
		message = value.message;
    }
	}

    async function changeName() {
		console.log('changing name');
        if (newName == '' ||  newName == null) {
            message = 'Please enter a new name';
        } else {


		const response = await fetch('/api/updateUserName', {
			method: 'POST',
			body: JSON.stringify({ userid, newName }),
			headers: {
				'content-type': 'application/json'
			}
		});
		const value = await response.json();
		await tick();
		console.log('value from change is ', value);
		message = value.message;
    }
	}
</script>

<h1>Settings</h1>

{#if allowNameChange}
<button on:click={() => (openChangeName = true)}>Change Name</button>
{/if}
<button on:click={() => (openChangePassword = true)}>Change Password</button>

{#if openChangePassword}
	<h4>Change Password</h4>
	<input type="text" bind:value={currentPassword} placeholder="current password" />
	<input type="text" bind:value={newPassword} placeholder="new password" />
    <button on:click={changePassword}>Confirm</button>

    {/if}

    {#if openChangeName}
	<h4>Change Name</h4>
	<input type="text" bind:value={newName} placeholder="new name" />
    <button on:click={changeName}>Confirm</button>

    {/if}

<h4>{message}</h4>
