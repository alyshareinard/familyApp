<script lang="ts">
  //https://github.com/BulatDashiev/svelte-slider
	import { createEventDispatcher } from 'svelte';
	import Thumb from './Thumb.svelte';

	const dispatch = createEventDispatcher();

	let name: string[] = [];
	let range: boolean = false;
	let min: number = 0;
	let max: number = 100;
	let step: number = 1;
	let value: number[] = [min, max];
	let pos:number[];
	let active: boolean = false;
	let order: boolean = false;
  let myvalue: number[] = [];

	export { name, range, min, max, step, value, order, myvalue };

	$: if (active) setValue(pos);
	$: if (!active) setPos(value);
	$: if (range && order && active) pos = checkPos(pos);
	$: min, max, clamp();
	$: progress = `
    bottom: ${range ? Math.min(pos[0], pos[1]) * 100 : 0}%;
    top: ${100 - Math.max(pos[0], range ? pos[1] : pos[0]) * 100}%;
  `;

	function setValue(pos: number[]) {
		const offset = min % step;
		const width = max - min;
  
		value = pos
			.map((v) => min + v * width)
			.map((v) => Math.round((v - offset) / step) * step + offset);
		dispatch('input', value);
	}

	function setPos(value: number[]) {
		pos = value.map((v) => Math.min(Math.max(v, min), max)).map((v) => (v - min) / (max - min));
	}

	function checkPos(pos: number[]) {
    console.log("in checkpos")
		return [Math.min(...pos), Math.max(...pos)];
	}

	function clamp() {
    
		setPos(value);
		setValue(pos);
	}

  $:if (!active) {
    myvalue=value;
  }
</script>

<input type="number" value={value[0]} name={name[0]} />

<div class="track">
	<div class="progress" style={progress} />
	<Thumb bind:pos={pos[0]} on:active={({ detail: v }) => (active = v)}>
		<slot name="top">
			<slot>
				<div class="thumb" />
			</slot>
		</slot>
	</Thumb>

</div>

<style>
	input {
		display: none;
	}

	.track {
		margin:10% 10%;
		position: relative;
		height: 400px;
		width: 40px;
		border-radius: 100vh;
		background: var(--track-bg, #ebebeb);
	}

	.progress {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		border-radius: 100vh;
		background: var(--progress-bg, #8abdff);
	}

	.thumb {
		width: 16px;
		height: 16px;
		border-radius: 100vh;
		background: var(--thumb-bg, #5784fd);
	}
</style>
