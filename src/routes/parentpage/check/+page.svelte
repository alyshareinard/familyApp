<script lang="ts">
	import { onMount } from 'svelte';
	import { tick } from 'svelte';
    let showHistory:boolean = false;
	let moodHistory: { mood: number; date: string; valid: boolean }[];
	onMount(async () => {
		getMoodHistory(20);
	});

	async function getMoodHistory(numRecords: number) {
		await tick();
		const response = await fetch('/api/getMoodHistory?numRecords=' + numRecords, {
			method: 'GET',
			body: null,
			headers: {
				'content-type': 'application/json'
			}
		});

		const value = await response.json();
		await tick();
		moodHistory = await value;
		showHistory = true;
		return;
	}
</script>

<h1>Check in</h1>

<div>
    {#if showHistory}
    <h3>Higher values = more stress, range is 0-100</h3>
    {#each moodHistory as history}
        <div class="container">
            <div class="column"><p>{history.mood}</p></div>
            <div class="column"><p>{history.date}</p></div>
        </div>
    {/each}
    {/if}
</div>

<style>
    .container {
		display: flex;
		justify-content: space-around;
	}
	.column {
		padding: 0px 10px;
	}
	p {
		margin-top: 0px;
	}
</style>