<script lang="ts">
	//userpage
	import Slider from '$lib/slider/Slider.svelte';
	import { tick } from 'svelte';
	import { onMount } from 'svelte';
	import type { User } from '$lib/interfaces/user';
	import { goto } from '$app/navigation';
	import type { Kudos } from '$lib/interfaces/kudos';
	import type { CalEvents } from '$lib/interfaces/calevents';
	import { userRecord } from '$lib/stores/UserStore';
	import { getDateTime } from '$lib/utils/getDateTime';
	export let userid: string;
	//	let userRecord: User;
	console.log("userRecord", $userRecord)
	
	let myRecord = {} as User;

    userRecord.subscribe((data) => {
        myRecord = data;
    });
	let mounted: boolean = false;
	console.log("my record ", myRecord)
	
	let kudos: Kudos[];
	let events: CalEvents[];
	let userName:string=''
	onMount(() => {
		console.log("userRecord", $userRecord)
		if ($userRecord.valid == false) {
			userid = localStorage.getItem('userid') || '';
			userName = localStorage.getItem('userName') || '';
			if (userid == '') {
				goto('/');
			} else {
				getUserRecord(userid);
			}
		}
		mounted=true
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
		console.log("User record is now ", userRecord)
		
	}




//	let moodValue: number = 0;
	let possValues: number[] = [0, 100];
	$: moodValue = possValues[0];
	let oldMoodValue = 0;
	let points: number = $userRecord.points;
	let allowance: number = $userRecord.allowanceTotal;
	$: if (moodValue != oldMoodValue && mounted) {
		addMoodRecord(moodValue);
		oldMoodValue = moodValue;
	}

	async function addMoodRecord(newMoodValue: number) {
		const mood = newMoodValue;
		console.log("newMoodValue", newMoodValue)
		const date = getDateTime(new Date());
		const valid = true;
		const notes = '';

		const response = await fetch('/api/addMoodRecord', {
			method: 'POST',
			body: JSON.stringify({ mood, date, valid, notes, userid }),
			headers: {
				'content-type': 'application/json'
			}
		});

		const value = await response.json();

	}

	const href='/userpage/calendar'
</script>

<h1>Hi {userName}</h1>
<div class="mainContainer">
	<div class="optionsContainer">
		<div class="optionsItem"><h4>Points: {points}</h4></div>
		{#if $userRecord.isParent==false}
		<div class="optionsItem"><h4>Allowance: {allowance}</h4></div>
		{/if}
		<div class="optionsItem"><h4>Upcoming events</h4></div>

		{#if events}
		{#each events as event}
			<div class="optionsItem"><a href={href}>{event.title}</a> {event.date}</div>
		{/each}
		{/if}
		<div class="optionsItem"><h4>Kudos</h4></div>

		{#if kudos}
		{#each kudos as kudo}
			<div class="optionsItem">{kudo.date} {kudo.fromid} {kudo.toid} {kudo.reason}</div>
		{/each}
	
		{/if}

</div>

	<div class="moodContainer">
		<div>
			<Slider bind:myvalue={possValues}>
				<span class="selectorBox">&#9744;</span>
			</Slider>
		</div>


	</div>
</div>

<style>
	div {
		--thumb-bg: transparent;
		--progress-bg: #ff9355;
		--track-bg: #deffd7;
	}
	.selectorBox {
		position: flex;
		flex-direction: row;
		color: rgb(116, 199, 227);
		position: relative;
		font-size: 140px;
		left: 2.3px;
	}
	.moodContainer {
		display: flex;
		justify-content: space-around;
	}
	.optionsContainer {
		display: flex;
		flex-direction: column;
	}
	.optionsItem {
		margin: 5px;
	}
	.mainContainer {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}
	.column {
		padding: 0px 10px;
	}
	p {
		margin-top: 0px;
	}
</style>
