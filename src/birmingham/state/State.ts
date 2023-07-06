import Game from "../Game";
import Profile from "../Profile";

export default interface State {
    get name(): string;
    generateData(args: any, game: Game, profile: Profile): any;
    receiveData(args: any, game: Game, profile: Profile): any;
}