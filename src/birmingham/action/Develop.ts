import { Industry } from "../Constants";
import FactorySlot from "../FactorySlot";
import Game from "../Game";
import Profile from "../Profile";
import Action from "./Action";

export default class Develop implements Action {

    get name(): string { return "develop"; }

    canUseCard(card: string, game: Game, profile: Profile) {
        return true;
    }

    act(args: any, game: Game, profile: Profile) {
        const indystriesToDevelop: Array<Industry> = args.industries;
        if (indystriesToDevelop.length <= 0 || indystriesToDevelop.length > 2) throw new Error("只能研发(0, 2]个工厂");

        for (const industry of indystriesToDevelop) {
            const slot = profile.getValidFactorySlot(industry);
            if (!slot || slot.amount <= 0) throw new Error(`没有可以研发的工厂`);
            slot.amount--;
        }
    }
}