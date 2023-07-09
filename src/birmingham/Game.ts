import City from "./City";
import IndustrySlot from "./IndustrySlot";
import Link from "./Link";
import Profile from "./Profile";
import Action from "./action/Action";
import { Nullable } from "../libs/lang/Optional";
import { int, Pair, Predicator } from "../libs/CommonTypes";
import Registry from "../libs/management/Registry";
import MerchantSlot from "./MerchantSlot";
import { Era, Resources } from "./Constants";
import FactorySlot from "./FactorySlot";
import FactoryPattern from "./FactoryPattern";
import ObservableRegistry from "../libs/management/ObservableRegistry";
import { computeIfAbsent } from "../libs/lang/Collections";
import Market from "./Market";
import IdleState from "./state/IdleState";
import ChooseActionState from "./state/ChooseActionState";

export default class Game {
    readonly actions = new Registry<string, Action>(it => it.name);

    readonly factoryPatterns = new Registry<int, FactoryPattern>(it => it.uid);
    readonly markets = new Map<string, Market>();
    readonly cities = new Registry<string, City>(it => it.name);
    readonly factorySlots = new ObservableRegistry<int, FactorySlot>(it => it.uid);
    readonly industrySlots = new ObservableRegistry<int, IndustrySlot>(it => it.uid);
    readonly merchantSlots = new ObservableRegistry<int, MerchantSlot>(it => it.uid);
    readonly links = new ObservableRegistry<int, Link>(it => it.uid);
    readonly profiles = new Registry<number, Profile>(it => it.uid); 
    era: Era = "canal";
    roundCounter: int = 0;
    currentOrdinal: number = 0;

    constructor() {
        this.factorySlots.onAddListeners.add(fs => computeIfAbsent(fs.owner.factorySlots, fs.pattern.industry, () => [])[fs.pattern.level] = fs);
        this.industrySlots.onAddListeners.add(it => it.city.industrySlots.push(it));
        this.merchantSlots.onAddListeners.add(it => it.city.merchantSlots.push(it));
        this.links.onAddListeners.add(link => link.getEnds().forEach(city => city.links.push(link)));
        // TODO remove logic
    }

    getData(profile: Profile): any {
        return {
            factoryPatterns: this.factoryPatterns.values().map(it => it.save()),
            markets: Array.from(this.markets.entries()).map(it => [it[0], it[1].save()]),
            cities: this.cities.values().map(it => it.save()),
            factorySlots: this.factorySlots.values().map(it => it.save()),
            industrySlots: this.industrySlots.values().map(it => it.save()),
            merchantSlots: this.merchantSlots.values().map(it => it.save()),
            links: this.links.values().map(it => it.save()),
            profiles: this.profiles.values().map(it => profile === it ? it.save() : it.getSimpleData()),
            era: this.era,
            roundCounter: this.roundCounter,
            currentOrdinal: this.currentOrdinal,
        };
    }

    getUpdateData(profile: Profile): any {
        return {
            markets: Array.from(this.markets.entries()).map(it => [it[0], it[1].getUpdateData()]),
            factorySlots: this.factorySlots.values().map(it => it.getUpdateData()),
            industrySlots: this.industrySlots.values().map(it => it.getUpdateData()),
            merchantSlots: this.merchantSlots.values().map(it => it.getUpdateData()),
            links: this.links.values().map(it => it.getUpdateData()),
            profiles: this.profiles.values().map(it => profile === it ? it.save() : it.getSimpleData()),
            era: this.era,
            roundCounter: this.roundCounter,
            currentOrdinal: this.currentOrdinal,
        };
    }

    save(): any {
        return {
            factoryPatterns: this.factoryPatterns.values().map(it => it.save()),
            citie: this.cities.values().map(it => it.save()),
            industrySlots: this.industrySlots.values().map(it => it.save()),
            merchantSlots: this.merchantSlots.values().map(it => it.save()),
            factorySlots: this.factorySlots.values().map(it => it.save()),
            links: this.links.values().map(it => it.save()),
            profiles: this.profiles.values().map(it => it.save()),
            era: this.era,
            roundCounter: this.roundCounter,
            currentOrdinal: this.currentOrdinal,
        };
    }

    static load(data: any): Game {
        const game = new Game();
        data.factoryPatterns.forEach((it: any) => game.factoryPatterns.add(FactoryPattern.load(it)));
        data.cities.forEach((it: any) => game.cities.add(City.load(it)));
        data.industrySlots.forEach((it: any) => game.industrySlots.add(IndustrySlot.load(it, game)));
        data.merchantSlots.forEach((it: any) => game.merchantSlots.add(MerchantSlot.load(it, game)));
        data.factorySlots.forEach((it: any) => game.factorySlots.add(FactorySlot.load(it, game)));
        data.links.forEach((it: any) => game.links.add(Link.load(it, game)));
        data.profiles.forEach((it: any) => game.profiles.add(Profile.load(it, game)));
        game.era = data.era;
        game.roundCounter = data.roundCounter;
        game.currentOrdinal = data.currentOrdinal;

        game.refreshProfileStates();

        return game;
    }

    fallBack() {
        throw new Error("Method not implemented.");
    }

    initializeProfileStates() {
        this.profiles.values().forEach((profile, index) => profile.ordinal = index);
        this.era = "canal";
        this.prepareNewEra();
        this.refreshProfileStates();
    }

    refreshProfileStates() {
        this.profiles.values().forEach((profile, index) => {
            if (profile.ordinal === index) profile.state = new ChooseActionState();
            else profile.state = new IdleState();
        });
    }

    nextAction() {
        const profile = this.profiles.values().find(profile => profile.ordinal === this.currentOrdinal);
        if (!profile) throw new Error(`顺序错误`);
        
        profile.actionCounter++;
        if (profile.actionCounter >= 2) this.nextTurn();
        this.prepareNewAction();
    }

    prepareNewAction() {
        const profile = this.profiles.values().find(profile => profile.ordinal === this.currentOrdinal);
        if (!profile) throw new Error(`顺序错误`);
        profile.state = new ChooseActionState();
    }

    nextTurn() {
        this.currentOrdinal = this.currentOrdinal + 1;
        if (this.currentOrdinal >= this.profiles.size()) this.nextRound();
        this.prepareNewTurn();
    }

    prepareNewTurn() {
        this.profiles.values().forEach((profile) => profile.actionCounter = 0);
        this.prepareNewAction();
    }

    nextRound() {
        this.roundCounter++;
        if (this.roundCounter >= 10) this.nextEra();
        this.prepareNewRound();
    }

    prepareNewRound() {
        this.currentOrdinal = 0;
        this.prepareNewTurn();
    }

    nextEra() {
        if (this.era === "canal") {
            this.era = "rail";
        } else if (this.era === "rail") {
            this.era = "end";
        }
        this.prepareNewEra();
    }

    prepareNewEra() {
        this.roundCounter = 0;
        this.prepareNewRound();
    }

    getLink(end1: City, end2: City): Nullable<Link> {
        return this.links.values().find(link => link.isLinkOf(end1, end2)) || null;
    }

    getLinksOf(city: City): Array<Link> {
        return this.links.values().filter(link => link.connectedCity(city));
    }

    // 返回-1代表不可达
    getDistance(startCity: City, endCity: City, profile?: Profile): int {
        const queue: Array<Pair<City, int>> = [[startCity, 0]];
        const visitedCities = new Set<City>([startCity]);

        while (queue.length > 0) {
            const [city, distance] = queue.shift()!;
            visitedCities.add(city);

            if (city === endCity) return distance;

            const nextDistance = distance + 1;
            let nextCities = [...this.getLinksOf(city)]
                .filter(link => link.built)
                .map(link => link.getOtherEnd(city))
                .filter(city => !visitedCities.has(city));
            if (profile) {
                nextCities = nextCities.filter(city => city.hasFactoryOf(profile));
            }
            queue.push(...nextCities.map(c => [c, nextDistance] as Pair<City, int>));
        }

        return -1;
    }

    // 返回-1代表不可达
    getShortestDistanceToCoal(startCity: City): int {
        const queue: Array<Pair<City, int>> = [[startCity, 0]];
        const visitedCities = new Set<City>([startCity]);

        while (queue.length > 0) {
            const [city, distance] = queue.shift()!;
            visitedCities.add(city);

            if (city.hasResource(Resources.COAL)) return distance;

            const nextDistance = distance + 1;
            let nextCities = [...this.getLinksOf(city)]
                .filter(link => link.built)
                .map(link => link.getOtherEnd(city))
                .filter(city => !visitedCities.has(city));
            queue.push(...nextCities.map(c => [c, nextDistance] as Pair<City, int>));
        }

        return -1;
    }
    
    findIndustrySlot(predicate: Predicator<IndustrySlot>, config?: NetworkSearchingConfig): Nullable<IndustrySlot> {

        const profile: Nullable<Profile> = config?.profile || null; 
        const startCities: Array<City> = config?.startCities || []; 
        const pseudoLinks: Array<Link> = config?.pseudoLinks || []; 

        if (startCities.length === 0) {
            const cancidates = this.industrySlots.values().filter(city => predicate(city));
            if (cancidates.length === 0) return null;
            if (profile) return cancidates.find(it => it.city.hasFactoryOf(profile)) || null;
            else return cancidates[0];
        }


        for (const city of startCities) {
            const visitedCities = new Set<City>([city]);
            const queue: Array<City> = [city];

            while (queue.length > 0) {
                const city = queue.shift()!;
                visitedCities.add(city);

                const slot = city.industrySlots.find(it => predicate(it));
                if (slot) return slot;

                let nextCities = [
                    ...this.getLinksOf(city).filter(link => link.built), 
                    ...pseudoLinks.filter(it => it.connectedCity(city)),
                ]
                    .map(link => link.getOtherEnd(city))
                    .filter(city => !visitedCities.has(city));
                if (profile) {
                    nextCities = nextCities.filter(city => city.hasFactoryOf(profile));
                }
                queue.push(...nextCities);
            }
        }

        return null;
    }
}

export interface NetworkSearchingConfig {
    profile?: Profile; // 若不为空，则会对城市与玩家进行匹配
    startCities?: Array<City>; // 起点城市，若为空则表示在整个网络内搜索
    pseudoLinks?: Array<Link>; // 这些link的所有者默认为profile字段表示的玩家，若profile为空，则当作任意玩家均可使用
}