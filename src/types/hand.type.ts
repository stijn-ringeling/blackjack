import type { CardType } from "./Card.type";

export type HandType = {
    cards: CardType[],
    value: number,
    bust: boolean
}