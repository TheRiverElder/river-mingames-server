import Game from "../Game";
import Profile from "../Profile";

export default interface Action {
    get name(): string;

    canUseCard(card: string, game: Game, profile: Profile): boolean;

    act(args: any, game: Game, profile: Profile): void;
}