<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { userRecord } from '$lib/stores/UserStore';
	import type { User } from '$lib/interfaces/user';
    import type { Login } from '$lib/interfaces/login';
    import type { AllowanceRecord } from '$lib/interfaces/allowanceRecord';
	import { page } from '$app/stores'
    import { tick } from 'svelte';
	let userid: string;
	let children: {id:string, name:string}[];
	console.log('userRecord', $userRecord);
	let myRecord = {} as User;
	console.log("HERE IS THE PAGE DATA", $page)
	userRecord.subscribe((data) => {
		myRecord = data;
	});
    let transactions: AllowanceRecord[]
	let kidAllowances:{id:string, name:string, transactions:AllowanceRecord[]}[]

	console.log('my record ', myRecord);

	onMount(async () => {
		userid = localStorage.getItem('userid') || '';

        console.log("is parent = ", $userRecord.isParent)

		if ($userRecord.valid == false) {
			userid = localStorage.getItem('userid') || '';
			console.log("userid is ", userid)
			if (userid == '') {
				goto('/');
			} else {
				getUserRecord(userid);
			}
		}

		if ($userRecord.isParent && $userRecord.children.length > 0) {
			for (let i = 0; i < children.length; i++) {
				getAllowance(children[i].id, children[i].name);
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
		userRecord.set(value);
	}

    async function getAllowance(userid:string, name:string){

		const response = await fetch('/api/getAllowance?userid=' + userid, {
			method: 'GET',
			body: null,
			headers: {
				'content-type': 'application/json'
			}
		});
		const value = await response.json();
		await tick();
        if ($userRecord.isParent) {
            kidAllowances.push({id:userid, name:name, transactions:value})
        } else {
            transactions = value
        }
		
		
	}
    
</script>

<h1>Allowance</h1>

{#if $userRecord.isParent}
Parent page
	<div class="summaryContainer">
		<h3>Current Total</h3>
	</div>
    {#each kidAllowances as record}
    {record.name}
    {#each record.transactions as transaction}
    {transaction.amount}
    {/each}
    {/each}
{:else}
	<h3>Current Total</h3>

	<h3>Transactions</h3>
    {transactions}
{/if}

<style>
	.summaryContainer {
		width: 50%;
	}
</style>
