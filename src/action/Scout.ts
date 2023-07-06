import Game from "../Game";
import Profile from "../Profile";
import Action from "./Action";

export default class Scout implements Action {

    canUseCard(card: string, game: Game, profile: Profile) {
        return true;
    }

    act(args: any, game: Game, profile: Profile) {
        const extraCards: Array<string> = args.extraCards;
        if (extraCards.length !== 2) throw new Error("Cannot scout, because extra cards is not exactly 2.");
        const newHandCards = profile.cards.slice();
        for (let handIndex = 0; handIndex < newHandCards.length; ) {
            const handCard = newHandCards[handIndex];
            const extraCardIndex = extraCards.indexOf(handCard);
            if (extraCardIndex >= 0) {
                newHandCards.splice(handIndex, 1);
                extraCards.splice(extraCardIndex, 1);
            } else {
                handIndex++;
            }
        }
        if (extraCards.length > 0) throw new Error("Cannot scout, because hand cards does not contains the extra cards.");
        profile.cards = newHandCards;
    }
}