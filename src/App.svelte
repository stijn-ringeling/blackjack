<script lang="ts">
import { tick } from "svelte";
import { handle_promise } from "svelte/internal";

	import Card from "./Card.svelte";
	import Hand, { calculateValue } from "./Hand.svelte";
	import Player from "./Player.svelte";
	import type { CardType } from "./types/Card.type";
	import type { DeckType } from "./types/Deck.type";
	import type { HandType } from "./types/hand.type";
	import type { PlayerType } from "./types/Player.type";
	import { SuitType } from "./types/Suit.type";
	import { ValueType } from "./types/Value.type";
	let deck:DeckType = createDeck();
	
	//let player:HandType;
	let players: PlayerType[];

	let dealer:PlayerType;

	let gameOver: boolean;

	//let standing: boolean;
	//let result: "win" | "lose" | "draw";

	function createDeck():DeckType {
		let deck: DeckType = {cards: []};
		for (let suit in SuitType){
			for(let value=1; value <= 13; value++){ //Loop over all integers in ValueType enum
				const s: SuitType = SuitType[suit];
				//const v: ValueType = ValueType[value];
				deck.cards = [...deck.cards, {value: value, suit: s}];
			}
		}
		return deck;
	}

	function draw(hand: HandType):void{
		let index = Math.floor(Math.random() * deck.cards.length);
		hand.cards = [...hand.cards, deck.cards[index]];
		deck.cards.splice(index, 1);
		deck.cards = [...deck.cards];
	}

	function hit(player: PlayerType): void{
		draw(player.hand);
		player.hand.value = calculateValue(player.hand.cards);
		player.hand.bust = player.hand.value > 21;
		if (player.hand.value >= 21){
			stand(player);
		}
		checkShouldEnd();
		players = [...players];
	}
	
	function stand(player:PlayerType):void{
		player.standing = true;
		
		checkShouldEnd();

		players = [...players];
		/*
		if(player.value >= 21){
			result = player.value == 21? "win": "lose";
			return;
		}
		if (dealer.value <= 18){
			draw(dealer);
			dealer.value = calculateValue(dealer.cards);
		}
		while (dealer.value < 17 && deck.cards.length > 0 ){
			draw(dealer);
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
		result = dealer.value > player.value ? "lose" : "win";*/
	}

	function checkShouldEnd():void{
		let allDone = true;
		for (const player in players) {
			if (Object.prototype.hasOwnProperty.call(players, player)) {
				const element = players[player];
				if(!element.standing) allDone = false;
			}
		}
		if(allDone){
			endGame();
		}
	}

	function newGame():void{
		let numPlayers = 2;
		deck = createDeck();
		players = [];
		for(let i = 0; i < numPlayers; i++){ // Create all player objects
			
			let hand = {cards: [], value: 0, bust: false};
			let player: PlayerType = {hand: hand, standing: false, result: undefined};
			draw(player.hand);
			draw(player.hand);
			player.hand.value = calculateValue(player.hand.cards);
			if (player.hand.value == 21){
				stand(player);
			}
			players = [...players, player]
		}
		dealer = {hand: {cards: [], value: 0, bust:false}, standing: false, result: undefined};

		draw(dealer.hand);
		draw(dealer.hand);

		dealer.hand.value = calculateValue(dealer.hand.cards);
		gameOver = false;
	}

	function endGame(){
		//Check which players were bust/won
		gameOver = true;
		let playersDone = 0;
		for (const player in players) {
			if (Object.prototype.hasOwnProperty.call(players, player)) {
				const element = players[player];
				if(element.hand.value >= 21){
					playersDone++;
					element.result = element.hand.value == 21? "won": "lost";
					continue;
				}
			}
		}
		if(playersDone >= players.length){
			return;
		}
		//Have dealer draw cards until 17.
		if (dealer.hand.value <= 18){
			draw(dealer.hand);
			dealer.hand.value = calculateValue(dealer.hand.cards);
		}
		while (dealer.hand.value < 17 && deck.cards.length > 0 ){
			draw(dealer.hand);
			dealer.hand.value = calculateValue(dealer.hand.cards);
		}
		dealer.hand.bust = dealer.hand.value > 21;
		for (const player in players) {
			if (Object.prototype.hasOwnProperty.call(players, player)) {
				const element = players[player];
				if (element.result !== undefined) continue;
				if(element.hand.value <= 21 && dealer.hand.bust){
					element.result = "won";
					continue;
				}
				if(!dealer.hand.bust){
					if(element.hand.value < dealer.hand.value){
						element.result = "lost";
					}else if(element.hand.value > dealer.hand.value){
						element.result = "won";
					}else {
						element.result = "draw"
					}
				}
			}
		}	
		
	}

	newGame();
</script>

<main>
	
	<div class="dealer">
		<Hand bind:hand={dealer.hand} dealer={!gameOver}/>
	</div>
	
	{#if gameOver}
		<button on:click={newGame}>New Game</button>
	{/if}
	<div class="players">
		{#each players as player}
		<div class="controls">
			{#if gameOver}
			{#if player.result === "won"}
				<h1>You won!</h1>
			{:else if player.result === "lost"}
				<h1>You lost. Want to play again?</h1>
				{:else}
					<h1>Draw!</h1>
				{/if}
			{/if}
		</div>
			
			<Player bind:hand={player.hand} control={!player.standing} on:hit={() => hit(player)} on:stand={() => stand(player)}/>
		{/each}
		
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

	.players {
		margin-bottom: 2em;
	}

</style>