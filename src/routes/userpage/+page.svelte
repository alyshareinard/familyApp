<script lang="ts">
	import Slider from '$lib/slider/Slider.svelte';
	import { tick } from 'svelte';
	import { onMount } from 'svelte';
	import type { User } from '$lib/interfaces/user';
	import { goto } from '$app/navigation';
	import type { moodHist } from "$lib/interfaces/moodHist";
	let userid: string;
	let userRecord: User;
	let name: string = '';

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
		userRecord = value;
		name = userRecord.name;
	}

	let mounted: boolean = false;
	let showHistory: boolean = false;
	let moodHistory: moodHist[];
	let moodHistLoaded:boolean=false;
	export let moodValue: number[] = [0, 100];

	onMount(async () => {
		userid = localStorage.userid;
		if (userid) {
			getUserRecord(userid);
		} else {
			goto('/');
		}

		mounted = true;
	});
	let oldMoodValue = 0;
	let points: number = 0;
	$: if (moodValue[0] != oldMoodValue && mounted) {
		//		console.log('mood value has changed');
		//		moodHistory.unshift(newMoodRecord);

		//moodHistory = [...moodHistory];
		addMoodRecord(moodValue[0]);
		//		getMoodHistory(20);
		//		console.log("Mood history", moodHistory);
		oldMoodValue = moodValue[0];
	}

	async function addMoodRecord(newMoodValue: number) {
		const mood = newMoodValue;
		const curdate = new Date();
		const valid = true;
		const notes = '';

		const response = await fetch('/api/addMoodRecord', {
			method: 'POST',
			body: JSON.stringify({ mood, curdate, valid, notes, userid }),
			headers: {
				'content-type': 'application/json'
			}
		});

		const value = await response.json();
		if (moodHistLoaded) {
			await tick();
			if (moodHistory.length > 20) {
				moodHistory.pop();
			}

			moodHistory.unshift(value);
			moodHistory = [...moodHistory];
			console.log("mood history is: ", moodHistory)
			//		console.log(value);
		}
	}

	async function getMoodHistory(numRecords: number) {
		

		await tick();
		if (!moodHistLoaded) {
			const response = await fetch('/api/getMoodHistory?numRecords=' + numRecords + '&userid='+userid, {
				method: 'GET',
				body: null,
				headers: {
					'content-type': 'application/json'
				}
			});

			const value = await response.json();
			await tick();
			moodHistory = await value;
			moodHistLoaded=true;
			if (moodHistory.length == 0) {
				showHistory=false
			} else{
				showHistory=true
			}
		} else {
			showHistory = !showHistory;
		}
		        console.log("Value returned", moodHistory)
		return;
	}
</script>

<h1>Hi {name}</h1>
<div class="mainContainer">
	<div class="optionsContainer">
		<div class="optionsItem"><h4>Points: {points}</h4></div>

		<div class="optionsItem"><button><a href="/allowance">Allowance</a></button></div>

		<div class="optionsItem"><button><a href="/calendar">Calendar</a></button></div>

		<div class="optionsItem"><button><a href="/settings">Settings</a></button></div>

		<div class="optionsItem"><button on:click={() => getMoodHistory(20)}>Mood History</button></div>

		<div class="optionsItem"><button><a href="/rewards">Rewards</a></button></div>
	</div>

	<div class="moodContainer">
		<div>
			<Slider bind:myvalue={moodValue}>
				<span class="selectorBox">&#9744;</span>
			</Slider>
		</div>

		<div>
			{#if showHistory}
				<h3>history</h3>
				{#each moodHistory as history}
					<div class="container">
						<div class="column"><p>{history.moodValue}</p></div>
						<div class="column"><p>{history.date}</p></div>
					</div>
				{/each}
			{/if}
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
