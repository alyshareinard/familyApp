<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	//	import { userRecord } from '$lib/stores/UserStore';
	import type { User } from '$lib/interfaces/user';
	import type { AllowanceRecord } from '$lib/interfaces/allowanceRecord';
	import { tick } from 'svelte';
	import { getDateTime } from '$lib/utils/getDateTime';
	import { enhance } from '$app/forms';

	let userid: string;
	let children: { id: string; name: string }[];
	//	console.log('userRecord', $userRecord);
	let openTransactionForm=false
	let userRecord: User;
	let transactions: AllowanceRecord[];
	let kidAllowances: { id: string; name: string; transactions: AllowanceRecord[] }[] = [];
	let approved:boolean

	let newAmount: number;
	let newReason: string;
	
	//	console.log('my record ', myRecord);

	onMount(async () => {
		let tryuserid = localStorage.getItem('userid');
		if (!tryuserid) {
			tryuserid = '475625';
			localStorage.setItem('userid', tryuserid);
		}
		if (tryuserid) {
			userid = tryuserid;
			const tryuserRecord = localStorage.getItem('userRecord');
			if (tryuserRecord) {
				userRecord = JSON.parse(tryuserRecord);
			} else {
				getUserRecord(userid);
			}
		} else {
			goto('/');
		}
		console.log('UserRecord is ', userRecord.children.length);
		if (userRecord.isParent && userRecord.children && userRecord.children.length > 0) {
			for (let i = 0; i < userRecord.children.length; i++) {
				getAllowance(userRecord.children[i].id, userRecord.children[i].name);
			}
		} else {
			getAllowance(userid, '');
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
		userRecord = value;
		localStorage.setItem('userRecord', JSON.stringify(userRecord));
	}

	async function getAllowance(userid: string, name: string) {
		console.log('Get Allowance');
		const response = await fetch('/api/getAllowance?userid=' + userid, {
			method: 'GET',
			body: null,
			headers: {
				'content-type': 'application/json'
			}
		});
		let value = await response.json();
		await tick();
		console.log(value);
		if (value == null || value.length == 0) {
			value = [
				{
					amount: 0,
					date: getDateTime(new Date()),
					valid: true,
					reason: ''
				}
			];
		}
		if (userRecord && userRecord.isParent) {
			approved=true
			kidAllowances.push({ id: userid, name: name, transactions: value });
		} else {
			approved=false
			transactions = value;
		}
		kidAllowances = kidAllowances;
		console.log('kidAllowances', kidAllowances);
	}
	async function addAllowanceRecord(kiduserid:string, kidTotalAllowance:number) {
		console.log('Add Allowance Transaction');
		const response = await fetch('/api/addAllowanceRecord', {
			method: 'POST',
			body: JSON.stringify({
				userid:kiduserid,
				amount: newAmount,
				date: getDateTime(new Date()),
				valid: true,
				reason: newReason,
				approved:approved,
			})
		})
		newAmount=0;
		newReason="";
	}
</script>

<h1>Allowance</h1>
{#if userRecord}
	{#if userRecord.isParent}
		Parent page

		<h3>Current Total</h3>

		{#each kidAllowances as record}
			<div class="summaryContainer">
				{record.name}
				{#if record.transactions}
					<div class="transactionContainer">
						<p>Date</p>
						<p>Amount</p>
						<p>Reason</p>
						<p>Actions</p>
						{#each record.transactions as transaction}
							<p>{transaction.date}</p>
							<p>{transaction.amount}</p>
							<p>{transaction.reason}</p>
							<button>Cancel</button>
						{/each}
					</div>
				{/if}
				<button on:click={() => (openTransactionForm = true)}>New transaction</button>
				{#if openTransactionForm}
					<form>
						<label for="amount" >Amount</label>
						<input type="number" name="amount" id="amount" bind:value={newAmount} />

						<label for="reason">Reason</label>
						<input type="text" name="reason" id="reason" bind:value={newReason} />

						<label for="date">Date</label>
						<input type="string" name="date" id="date" value={getDateTime(new Date())}/>

						<button on:click={()=>addAllowanceRecord(record.id)} type="submit" >Submit</button>
					</form>
				{/if}
				
			</div>
		{/each}
	{:else}
		<h3>Current Total</h3>

		<h3>Transactions</h3>
		{transactions}
	{/if}
{/if}

<style>
	.summaryContainer {
		margin-bottom: 40px;
		width: 50%;
		display: flex;
		flex-direction: column;
	}
	.transactionContainer {
		display: grid;
		grid-template-columns: 2fr 1fr 2fr 1fr;
		grid-gap: 20px;
	}
</style>
