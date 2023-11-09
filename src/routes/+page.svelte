<script lang="ts">
	import Slider from '$lib/slider/Slider.svelte';

	export let moodValue: number[] = [0, 100];
	let moodHistory: { mood: number; date: string }[] = [];

	let oldMoodValue = 0;

	$: if (moodValue[0] != oldMoodValue) {
		console.log('mood value has changed');
		moodHistory.unshift({
			mood: moodValue[0],
			date: getDateTime()
		});
        moodHistory=[...moodHistory]
		console.log(moodHistory);
		oldMoodValue = moodValue[0];
	}

	console.log(moodValue);

    function getDateTime(date:Date = new Date()) {
        const dayOfMonth = date.getDate();
        const month = date.getMonth(); // Be careful! January is 0, not 1
        const year = date.getFullYear();

        const dateString = dayOfMonth + "-" + (month + 1) + "-" + year;
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        let strminutes = minutes < 10 ? '0'+minutes : minutes;
        let strTime = hours + ':' + strminutes + ' ' + ampm;
        return dateString + ' ' + strTime;

    }
</script>

<div class="container">
	<div>
		<p>value: {moodValue[0]}</p>

		<Slider bind:myvalue={moodValue}>
			<span class="selectorBox">&#9744;</span>
		</Slider>
	</div>

	<div>
		<h3>history</h3>
		{#each moodHistory as history}
			<div class="container">
                <div class="column"><p>{history.mood}</p></div>
				<div class="column"><p>{history.date}</p></div>
				
			</div>
		{/each}
	</div>
</div>

<style>
	div {
		--thumb-bg: transparent;
		--progress-bg: #ff9355;
		--track-bg: #deffd7;
	}
	.selectorBox {
		color: blue;
		font-size: 40px;
	}
	.container {
		display: flex;
		justify-content: space-around;
	}
    .column{
        padding:0px 10px;
    
    }
    p {
        margin-top:0px;
    }
</style>
