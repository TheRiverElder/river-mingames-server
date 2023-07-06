import Game from "../Game";
import Profile from "../Profile";
import Action from "./Action";

export default class Loan implements Action {

    canUseCard(card: string, game: Game, profile: Profile) {
        return true;
    }

    act(args: any, game: Game, profile: Profile) {
        if (profile.track.getIncomeLevel() - 3 < -10) throw new Error("Cannot loan, because income level is too low.");
        profile.track.fall(3);
        profile.coins += 30;
    }
}