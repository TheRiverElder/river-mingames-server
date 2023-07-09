import Game from "../Game";
import Profile from "../Profile";
import Action from "./Action";

export default class Scout implements Action {

    get name(): string { return "scout"; }

    canUseCard(card: string, game: Game, profile: Profile) {
        return true;
    }

    act(args: any, game: Game, profile: Profile) {
        const extraCards: Array<string> = args.extraCards;
        if (extraCards.length !== 2) throw new Error("必须刚好消耗2张手牌");
        
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
        if (extraCards.length > 0) throw new Error("消耗手牌错误");
        profile.cards = newHandCards;
    }
}