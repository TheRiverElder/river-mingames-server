import City from "./City";
import { Resources } from "./Constants";
import FactorySlot from "./FactorySlot";
import Game from "./Game";
import Track from "./Track";
import IdleState from "./state/IdleState";
import State from "./state/State";

export default class Profile {
    readonly uid: number;
    name: string = "";
    cards: Array<string> = [];
    factories: Array<[string, Array<FactorySlot>]> = []; // [Industry, factories]
    coins: number = 0;
    costCoinCounter: number = 0;
    track: Track = new Track();

    state: State = new IdleState();

    constructor(uid: number) {
        this.uid = uid;
    }

    gain(awards: Array<[string, number]>) {
        for (const [type, amount] of awards) {
            switch (type) {
                case Resources.COIN: this.coins += amount; break;
                case Resources.INCOME: this.track.climb(amount); break;
                default: throw new Error(`Cannot gain ${type}`); break;
            }
        }
    }

    pay(game: Game, resources: Array<[string, number]>) {
        for (const [type, amount] of resources) {
            switch (type) {
                case Resources.COIN: this.coins -= amount; break;
                case Resources.INCOME: this.track.fall(amount); break;
                case Resources.COAL: 
                case Resources.IRON: 
                case Resources.BEER: {
                    // TODO
                    game.findResource(this, type, type === Resources.COAL);
                    break;
                }
                default: throw new Error(`Cannot gain ${type}`); break;
            }
        }
    }

    hasNetWork(game: Game): boolean {
        return Array.from(game.cities.values()).some(city => city.industrySlots.some(slot => slot.factory && slot.factory.owner === this));
    }

    isCityConnected(game: Game, city: City): boolean {
        if (city.industrySlots.some(slot => slot.factory && slot.factory.owner === this)) return true;
        
        const visitedCities = new Set<City>();
        const queue: Array<City> = [city];
        while (queue.length > 0) {
            const city = queue.shift()!;

            if (city.industrySlots.some(slot => slot.factory && slot.factory.owner === this)) return true;

            const nextCities = game.getLinksOf(city)
                .filter(link => link.owner)
                .map(link => link.getOtherEnd(city))
                .filter(city => !visitedCities.has(city));
            queue.push(...nextCities);
        }

        return false;
    }
}