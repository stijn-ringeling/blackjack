<script lang="ts">
import type { CardType } from "./types/Card.type";
    export let card: CardType
    export let hidden: boolean;
</script>
<div>
    <div class="card">
        {#if !hidden}
            {card.value} <br/>{card.suit}
        {:else}
            Hidden
        {/if}
        
    </div>
</div>


<style>
    .card{
        height: 7em;
        width: 5em;
        border: 2px black ;
        border-style: solid;
        margin: 0.5em;
    }
</style>