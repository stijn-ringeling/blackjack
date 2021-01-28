<script lang="ts">
import { createEventDispatcher } from "svelte";

import Hand from "./Hand.svelte";
import type { HandType } from "./types/hand.type";


    export let hand:HandType;
    export let control:boolean = false;

    const dispatch = createEventDispatcher();

    function hit(){
        dispatch('hit');
    }
    function stand(){
        dispatch('stand');
    }
</script>

<div class="controls">
    {#if control}
        <button on:click={hit} class="hit" >Hit!</button> <button on:click={stand} class="stand">Stand</button>
    {/if}
</div>
<Hand bind:hand={hand}/>

