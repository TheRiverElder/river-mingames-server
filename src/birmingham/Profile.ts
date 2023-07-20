import City from "./City";
import { Industry, Resources } from "./Constants";
import FactorySlot from "./FactorySlot";
import Game from "./Game";
import Track from "./Track";
import IdleState from "./state/IdleState";
import State from "./state/State";
import { Nullable } from "../libs/lang/Optional";
import IndustrySlot from "./IndustrySlot";
import { int, Pair } from "../libs/CommonTypes";
import Market from "./Market";

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
        profile.factorySlots = new Map(data.factorySlots.map(([industory, slotsData]: any) => [industory, slotsData.map((d: any) => FactorySlot.load(d, game))]));
        profile.costCoinCounter = data.costCoinCounter;
        profile.goals = data.goals;
        profile.income = data.income;
        profile.ordinal = data.ordinal;
        profile.actionCounter = data.actionCounter;
        return profile;
    }

    getSimpleData() {
        return {
            uid: this.uid,
            name: this.name,
            cards: this.cards.map(it => "card_back"),
            money: this.money,
            factorySlots: Array.from(this.factorySlots.entries()).map(([industory, slots]) => [industory, slots.map(s => s.save())]),
            costCoinCounter: this.costCoinCounter,
            goals: this.goals,
            income: this.income.save(),
            ordinal: this.ordinal,
            actionCounter: this.actionCounter,
        };
    }

    getValidFactorySlot(industry: Industry): Nullable<FactorySlot> {
        const slots = this.factorySlots.get(industry);
        if (!slots) return null;
        return slots.find(s => s.amount > 0) || null;
    }

    gain(type: string, amount: int) {
        switch (type) {
            case Resources.COIN: this.money += amount; break;
            case Resources.INCOME_POINT: this.income.climb(amount); break;
            default: throw new Error(`Cannot gain ${type}`); break;
        }
    }

    gainAll(resources: Array<Pair<string, int>>) {
        resources.forEach(p => this.gain(...p));
    }

    pay(type: string, amount: int) {
        switch (type) {
            case Resources.COIN: this.money -= amount; break;
            case Resources.INCOME_POINT: this.income.fall(amount); break;
            default: throw new Error(`Cannot pay ${type}`); break;
        }
    }

    payAll(resources: Array<Pair<string, int>>) {
        resources.forEach(p => this.pay(...p));
    }

    payFromSource(type: string, amount: int, game: Game, source: IndustrySlot, targets: Array<City>) {
        const factory = source.factory;
        if (!factory || !factory.resources || factory.resources[0] !== type || factory.resources[1] < amount) throw new Error(`工厂上没有足够的${type}`);
        // TODO 检查是否符合要求
        // 煤炭要链接网路而且必须是最近的
        if (type === Resources.COAL) {
            for (const target of targets) {
                const distance = game.getDistance(target, source.city);
            }
        }
        // 钢铁可以飞
        // 啤酒自己的可以飞，对手的要链接网路
        factory.resources[1] -= amount;
    }

    payFromMarket(type: string, amount: int, game: Game, market: Market) {
        
    }

    hasNetWork(game: Game): boolean {
        return game.cities.values().some(city => city.hasFactoryOf(this)) || game.links.values().some(link => link.owner === this);
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

    canPlaceFactoryAtCity(city: City, game: Game): boolean {
        if (!this.hasNetWork(game)) return true;
        return this.getCitiesThatCanBuildFactory(game).has(city);
    }

    getCitiesThatCanBuildFactory(game: Game): Set<City> {
        const results = new Set<City>();

        for (const link of game.links.values()) {
            if (!link.built) continue;
            for (const city of link.getEnds()) {
                if (city.hasFactoryOf(this)) {
                    link.getEnds().forEach(it => results.add(it));
                    break;
                }
            }
        }

        return results;
    }
}