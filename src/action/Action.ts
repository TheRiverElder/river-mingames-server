import Game from "../Game";
import Profile from "../Profile";

export default interface Action {

    canUseCard(card: string, game: Game, profile: Profile): boolean;

    act(args: any, game: Game, profile: Profile): void;
}