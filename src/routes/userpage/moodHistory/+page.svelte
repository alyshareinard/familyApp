<script lang="ts">
	//userpage
	import Slider from '$lib/slider/Slider.svelte';
	import { tick } from 'svelte';
	import { onMount } from 'svelte';
	import type { User } from '$lib/interfaces/user';
	import { goto } from '$app/navigation';
	import type { moodHist } from '$lib/interfaces/moodHist';
	import { userRecord } from '$lib/stores/UserStore';
	import { getDateTime } from '$lib/utils/getDateTime';
	export let userid: string;
    console.log("Userid is ", userid)
	//	let userRecord: User;
	console.log('userRecord', $userRecord);

	let myRecord = {} as User;

	userRecord.subscribe((data) => {
		myRecord = data;
		console.log('my record ', myRecord);
	});
	let showHistory: boolean = false;

	console.log('my record ', myRecord);

	onMount(() => {
		console.log('userRecord', $userRecord);
		if ($userRecord.valid == false) {
			userid = localStorage.getItem('userid') || '';
			console.log("userid is ", userid)
			if (userid == '') {
				goto('/');
			} else {
				getUserRecord(userid);
			}
		}
	});

	$: if(userid) {
		console.log("getting history for ", userid)
		getMoodHistory(20);
		mounted = true;
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
		userRecord.set(value);
	}

	let mounted: boolean = false;

	let moodHistory: moodHist[];
	let moodHistLoaded: boolean = false;
	export let moodValue: number[] = [0, 100];

	let oldMoodValue = 0;

	$: if (moodValue[0] != oldMoodValue && mounted) {
		addMoodRecord(moodValue[0]);
		oldMoodValue = moodValue[0];
	}

	async function addMoodRecord(newMoodValue: number) {
		const mood = newMoodValue;
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
		if (moodHistLoaded) {
			await tick();
			if (moodHistory.length > 20) {
				moodHistory.pop();
			}

			moodHistory.unshift(value);
			moodHistory = [...moodHistory];
			console.log('mood history is: ', moodHistory);
			//		console.log(value);
		}
	}

	async function getMoodHistory(numRecords: number) {
		await tick();
		console.log("in getmoodhistory in page for ", userid)
		if (!moodHistLoaded) {
			const response = await fetch(
				'/api/getMoodHistory?numRecords=' + numRecords + '&userid=' + userid,
				{
					method: 'GET',
					body: null,
					headers: {
						'content-type': 'application/json'
					}
				}
			);

			const value = await response.json();
			await tick();
			moodHistory = await value;
			console.log('!!!!!moodhistory', moodHistory);
			moodHistLoaded = true;
			if (moodHistory.length == 0) {
				showHistory = false;
			} else {
				showHistory = true;
			}
		} else {
			showHistory = !showHistory;
		}
		console.log('Value returned', moodHistory);
		return;
	}
	$: console.log('MOOD VALUE: ', moodValue);
</script>

<h1>Mood History</h1>
<div class="mainContainer">
	<div class="moodContainer">
		<div>
			{#if showHistory}
				<h3>History</h3>
				<div class="columnContainer">
					<p style="font-weight: bold;">Mood</p>
					<p style="font-weight: bold;">Date</p>
				</div>
				{#each moodHistory as history}
					<div class="columnContainer">
						<p>{history.moodValue}</p>
						<p>
							{history.date}
						</p>
					</div>
				{/each}
			{/if}
		</div>
	</div>
	<div>
		<Slider bind:myvalue={moodValue}>
			<span class="selectorBox">&#9744;</span>
		</Slider>
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

	.mainContainer {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}
	.columnContainer {
		padding: 0px 10px;
		display: flex;

		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
	}
	p {
		margin-top: 0px;
	}
</style>
