import City from "./City";
import { CITIES_ARGS } from "./CommonData";
import Game from "./Game"
import IndustrySlot from "./IndustrySlot";
import Profile from "./Profile";
import Loan from "./action/Loan";
import { Nullable } from "./lang";

export default function createGame(playerAmount: number): Game {
    const game = new Game();

    for (let index = 0; index < playerAmount; index++) {
        createAndAddProfile(game);
    }

    CITIES_ARGS.forEach((args) => createAndAddCity(game, ...args));

    game.actions.set("loan", new Loan());

    return game;
}

function createAndAddProfile(game: Game) {
    const profile = new Profile(game.genUid());
    profile.name = `Player-${profile.uid}`;
    game.profiles.set(profile.uid, profile); 
}

function createAndAddCity(game: Game, name: Nullable<string>, industrySlotArgs: Array<Array<string>>) {
    const city = new City(game.genUid(), name);
    city.industrySlots.push(...industrySlotArgs.map(args => new IndustrySlot(city, args)));
    game.cities.set(city.uid, city);
}