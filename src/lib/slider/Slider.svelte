<script lang="ts">
	//adapted from https://github.com/BulatDashiev/svelte-slider
	import { createEventDispatcher } from 'svelte';
	import Thumb from './Thumb.svelte';

	const dispatch = createEventDispatcher();


	let name: string[] = [];
	let range: boolean = false;
	let min: number = -47;
	let max: number = 111;
	let step: number = 1;
	let value: number[] = [0, 100];
	let pos: number[];
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
		const height = max - min;

		value = pos
			.map((v) => min + v * height)
			.map((v) => Math.round((v - offset) / step) * step + offset);

		dispatch('input', value);
	}

	function setPos(value: number[]) {
		pos = value.map((v) => Math.min(Math.max(v, min), max)).map((v) => (v - min) / (max - min));
	}

	function checkPos(pos: number[]) {
		
		return [Math.min(...pos), Math.max(...pos)];
	}

	function clamp() {
		setPos(value);
		setValue(pos);
	}

	$: if (!active) {
		myvalue = value;
	}
</script>

<input type="number" value={value[0]} name={name[0]} />

<div class="track">
	<div class="line1" />
  <div class="textbox1"><p >trés mal</p></div>
  
	<div class="line2" />
  <div class="textbox2"> <p >mal</p></div>
 
	<div class="line3" />
  <div class="textbox3"><p >moyen</p></div>
  
	<div class="line4" />
  <div class="textbox4"><p >bien</p></div>
  
	<div class="progress" style={progress} />
	<Thumb bind:pos={pos[0]} on:active={({ detail: v }) => (active = v)}>
		<slot name="top">
			<slot>
				<div class="thumb" />
			</slot>
		</slot>
	</Thumb>
</div>
<div class="bulb"></div>

<style>
	input {
		display: none;
	}

	.track {
		margin: 10% 10%;
		position: relative;
		height: 400px;
		width: 60px;
		border-radius: 100vh;
    border-color:black;
    border-width:5px;
    border-style:solid;
		background: linear-gradient(red, yellow, green);
	}

	.progress {
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		border-radius: 100vh;
		
	}

	.thumb {
		width: 16px;
		height: 16px;
		border-radius: 100vh;
		background: var(--thumb-bg, #5784fd);
	}
	.line1,
	.line2,
	.line3,
	.line4 {
		background: black;
		position: absolute;
		left: 10%;
		height: 2%;
		width: 80%;
	}
	.line1 {
		top: 20%;
	}
	.line2 {
		top: 40%;
	}
	.line3 {
		top: 60%;
	}
	.line4 {
		top: 80%;
	}

  .textbox1, .textbox2, .textbox3, .textbox4 {
    position: absolute;
    width:100%;
    justify-content:center;
    text-align:center;
  }

  .textbox1 {
    top:5%
  }
  .textbox2 {
    top:25%
  }
  .textbox3 {
    top:45%
  }
  .textbox4 {
    top:65%
  }
</style>
