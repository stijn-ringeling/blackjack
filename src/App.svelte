<script lang="ts">
import { tick } from "svelte";

	import Card from "./Card.svelte";
import Hand, { calculateValue } from "./Hand.svelte";
	import type { CardType } from "./types/Card.type";
	import type { DeckType } from "./types/Deck.type";
	import type { HandType } from "./types/hand.type";
	let deck:DeckType = createDeck();
	
	let player:HandType;

	let dealer:HandType;

	let standing: boolean;
	let result: "win" | "lose" | "draw";

	function createDeck():DeckType {
		let deck: DeckType = {cards: []};
		["Diamonds", "Hearts", "Spades", "Clubs"].forEach(suit => {
			["Ace", 2, 3, 4, 5, 6, 7, 8, 9, 10, "Jack", "Queen", "King"].forEach(value => {
				deck.cards = [...deck.cards, {value: value, suit: suit}];
			});
		});
	return deck;
	}

	function drawPlayer(): void{
		let index = Math.floor(Math.random() * deck.cards.length);
		player.cards = [...player.cards, deck.cards[index]];
		deck.cards.splice(index, 1);
		deck.cards = [...deck.cards];
	}

	function drawDealer(): void{
		let index = Math.floor(Math.random() * deck.cards.length);
		dealer.cards = [...dealer.cards, deck.cards[index]];
		deck.cards.splice(index, 1);
		deck.cards = [...deck.cards];
	}

	function hit(): void{
		drawPlayer();
		player.value = calculateValue(player.cards);
		player.bust = player.value > 21;
		if (player.value >= 21){
			stand();
		}
	}
	
	function stand():void{
		standing = true;
		if(player.value >= 21){
			result = player.value == 21? "win": "lose";
			return;
		}
		if (dealer.value <= 18){
			drawDealer();
			dealer.value = calculateValue(dealer.cards);
		}
		while (dealer.value < 17 && deck.cards.length > 0 ){
			drawDealer();
			dealer.value = calculateValue(dealer.cards);
		}
		dealer.bust = dealer.value > 21;
		if (dealer.bust) {
			result = "win";
			return;
		}
		if (dealer.value == player.value){
			result = "draw";
			return;
		}
		result = dealer.value > player.value ? "lose" : "win";
	}

	function newGame():void{
		deck = createDeck();
		player = {cards: [], value: 0, bust:false};
		dealer = {cards: [], value: 0, bust:false};

		drawDealer();
		drawDealer();
		drawPlayer();
		drawPlayer();
		standing = false;

		dealer.value = calculateValue(dealer.cards);
		player.value = calculateValue(player.cards);
		if (player.value == 21){
			stand();
		}
	}
	newGame();
</script>

<main>
	
	<div class="dealer">
		<Hand bind:hand={dealer} dealer={!standing}/>
	</div>
	<div class="controls">
		{#if !standing}
			<button on:click={hit} class="hit" >Hit!</button> <button on:click={stand} class="stand">Stand</button>
		{:else}
			{#if result === "win"}
				<h1>You won!</h1>
			{:else if result === "lose"}
				<h1>You lost. Want to play again?</h1>
				{:else}
					<h1>Draw!</h1>
					{/if}
		<button on:click={newGame}>New Game</button>
	{/if}
	</div>
	
	<div class="player">
		<Hand bind:hand={player}/>
	</div>
	
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}

	.dealer {
		margin-top: 2em;
	}

	.controls {
		margin-top: auto;
		margin-bottom: 2em;
	}

	.player {
		margin-bottom: 2em;
	}

	.hit {
		background-color: greenyellow;
	}

	.stand {
		background-color: orangered;
	}
</style>