import City from "./City";
import { Industry, Resources } from "./Constants";
import FactorySlot from "./FactorySlot";
import Game from "./Game";
import Track from "./Track";
import IdleState from "./state/IdleState";
import State from "./state/State";
import { Nullable } from "../libs/lang/Optional";

export default class Profile {
    readonly uid: number;
    name: string = "";

    cards: Array<string> = [];
    factorySlots = new Map<string, Array<FactorySlot>>(); // [Industry, factories]
    money: number = 0;
    costCoinCounter: number = 0;
    goals: number = 0;
    income: Track = new Track();

    ordinal: number = -1;
    actionCounter: number = 0;
    state: State = new IdleState();

    constructor(uid: number) {
        this.uid = uid;
    }

    save(): any {
        return {
            uid: this.uid,
            name: this.name,
            cards: this.cards,
            money: this.money,
            factorySlots: Array.from(this.factorySlots.entries()).map(([industory, slots]) => [industory, slots.map(s => s.save())]),
            costCoinCounter: this.costCoinCounter,
            goals: this.goals,
            income: this.income.save(),
            ordinal: this.ordinal,
            actionCounter: this.actionCounter,
        };
    }
    
    static load(data: any, game: Game): Profile {
        const profile = new Profile(data.uid);
        profile.name = data.name;
        profile.cards = data.cards;
        profile.factorySlots = new Map(data.factorySlots.map(([industory, slotsData]) => [industory, slotsData.map(d => FactorySlot.load(d, game))]));
        profile.costCoinCounter = data.costCoinCounter;
        profile.goals = data.goals;
        profile.income = data.income;
        profile.ordinal = data.ordinal;
        profile.actionCounter = data.actionCounter;
        return profile;
    }

    getValidFactorySlot(industry: Industry): Nullable<FactorySlot> {
        const slots = this.factorySlots.get(industry);
        if (!slots) return null;
        return slots.find(s => s.amount > 0) || null;
    }

    gain(awards: Array<[string, number]>) {
        for (const [type, amount] of awards) {
            switch (type) {
                case Resources.COIN: this.money += amount; break;
                case Resources.INCOME_POINT: this.income.climb(amount); break;
                default: throw new Error(`Cannot gain ${type}`); break;
            }
        }
    }

    pay(game: Game, resources: Array<[string, number]>) {
        for (const [type, amount] of resources) {
            switch (type) {
                case Resources.COIN: this.money -= amount; break;
                case Resources.INCOME_POINT: this.income.fall(amount); break;
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