<script lang="ts">
	import Slider from '$lib/slider/Slider.svelte';
	import { tick } from 'svelte';
    import { onMount } from 'svelte';
    let mounted:boolean=false
    let showHistory:boolean=false
	let name:string="Josh";
	export let moodValue: number[] = [0, 100];
	let moodHistory: { mood: number; date: string; valid: boolean }[];
    onMount(async () => {
        getMoodHistory(20)
        mounted=true
    })
	let oldMoodValue = 0;
	let points:number=0;
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

		const response = await fetch('/api/addMoodRecord', {
			method: 'POST',
			body: JSON.stringify({ mood, curdate, valid }),
			headers: {
				'content-type': 'application/json'
			}
		});

		const value = await response.json();
        await tick()
        if (moodHistory.length > 20) {
            moodHistory.pop()
        }
       
        moodHistory.unshift(value)
        moodHistory = [...moodHistory]
//		console.log(value);
	}

	async function getMoodHistory(numRecords: number) {
        await tick()
		const response = await fetch('/api/getMoodHistory?numRecords=' + numRecords, {
			method: 'GET',
			body: null,
			headers: {
				'content-type': 'application/json'
			}
		});

		const value = await response.json();
        await tick();
        moodHistory = await value
//        console.log("Value returned", moodHistory)
		return
	}


</script>
<h1>Hi {name}</h1>
<div class="mainContainer">
<div class="optionsContainer">
	<h4>Points: {points}</h4>
	<button><a href = "/allowance">Allowance</a></button>
	<button><a href = "/calendar">Calendar</a></button>
	<button><a href = "/password">Change password</a></button>
	<button on:click={() => (showHistory = !showHistory)}>Mood History</button>
	<button><a href = "/rewards">Rewards</a></button>
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
				<div class="column"><p>{history.mood}</p></div>
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
		position:flex;
		flex-direction:row;
		color: rgb(116, 199, 227);
        position:relative;
		font-size: 140px;
        left:2.3px;
	}
	.moodContainer {
		display: flex;
		justify-content: space-around;
	}
	.optionsContainer {
		display:flex;
		flex-direction:column;
	}
	.mainContainer {
		display:flex;
		flex-direction:row;
		justify-content:space-around;
	}
	.column {
		padding: 0px 10px;
	}
	p {
		margin-top: 0px;
	}
</style>
