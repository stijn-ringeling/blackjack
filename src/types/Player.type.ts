import type { HandType } from "./hand.type";

export type PlayerType = {
    hand: HandType,
    standing: Boolean,
    result: "won" | "lost" | "draw"
}