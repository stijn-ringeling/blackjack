<script context="module" lang="ts">
    export function calculateValue(cards: CardType[]): number{
        let aces = cards.filter((card: CardType) => card.value === ValueType.Ace);
        let others = cards.filter((card: CardType) => card.value !== ValueType.Ace);
        let normalValue = others.reduce( (total:number, card:CardType):number => {
            let value = 0;
            switch (card.value){
                case ValueType.Jack:
                case ValueType.Queen:
                case ValueType.King:
                    value = 10;
                    break;
                default:
                    //debugger;
                    value = card.value;
            }
            return total += value;
        }, 0);
        let currValue = normalValue + aces.length;
        for (let index = 0; index < aces.length; index++) {
            if (currValue + 10 <= 21){
                currValue += 10;
            }           
        }
        return currValue;
    }
</script>

<script lang="ts">
import { debug } from "svelte/internal";

import Card from "./Card.svelte";
import type { CardType } from "./types/Card.type";

import type { HandType } from "./types/hand.type";
import { ValueType } from "./types/Value.type";
    export let hand:HandType;
    export let dealer:boolean = false;
    let value = 0;
    $: hand.value = calculateValue(hand.cards);
    $: hand.bust = hand.value> 21;
</script>

<div>
    <b>Drawn cards ({dealer? "???": hand.bust? "Bust": hand.value}):</b><br/>
    <div class="cardRow">
        {#each hand.cards as card, i}
            <Card {card} hidden={i == 1 && dealer}/>
        {/each}
    </div>
</div>

<style>
    .cardRow{
        flex-direction: row;
        display: flex;
        justify-content: center;
    }

</style>