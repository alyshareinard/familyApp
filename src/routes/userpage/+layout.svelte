<script lang="ts">
/*	import { onMount } from 'svelte';
	import { userRecord } from '$lib/stores/UserStore';
	import { goto } from '$app/navigation';
    import {tick} from 'svelte';

	export let userid: string;
	onMount(() => {
		console.log('userRecord', $userRecord);
		if ($userRecord.id == '12345') {
			userid = localStorage.getItem('userid') || '';
            console.log("IN LAYOUT", userid)
			if (userid == '') {
				goto('/');
			} else {
				getUserRecord(userid);
			}
		}
	});

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
		userRecord.set(value);
	}*/
</script>

<nav>
	<button><a href="/userpage">Main</a></button>
	<button><a href="/userpage/allowance">Allowance</a></button>
	<button><a href="/userpage/calendar">Calendar</a></button>
	<button><a href="/userpage/moodHistory">Mood History</a></button>
	<button><a href="/userpage/rewards">Rewards</a></button>
	<button><a href="/userpage/settings">Settings</a></button>
</nav>
<slot />
