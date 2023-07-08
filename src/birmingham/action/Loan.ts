import Game from "../Game";
import Profile from "../Profile";
import Action from "./Action";

export default class Loan implements Action {

    get name(): string { return "loan"; }

    canUseCard(card: string, game: Game, profile: Profile) {
        return true;
    }

    act(args: any, game: Game, profile: Profile) {
        if (profile.income.getIncomeLevel() - 3 < -10) throw new Error("Cannot loan, because income level is too low.");
        profile.income.fall(3);
        profile.money += 30;
    }
}