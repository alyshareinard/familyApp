

<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { userRecord } from '$lib/stores/UserStore';
    import type { User } from '$lib/interfaces/user';
	let userid: string;
    console.log("userRecord", $userRecord)
    let myRecord = {} as User;

    userRecord.subscribe((data) => {
        myRecord = data;
    });

	console.log("my record ", myRecord)

    onMount(async () => {
		userid = localStorage.getItem('userid') || '';
		if (userid == '') {
			goto('/');
		} 
	});


   
</script>


<h1>Allowance</h1>

{#if $userRecord.isParent}

<div class=summaryContainer>

<h3>Current Total</h3>
</div>

{:else}


<h3>Current Total</h3>

<h3>Transactions</h3>

{/if}


<style>
    .summaryContainer{
        width:50%;
    }
</style>
