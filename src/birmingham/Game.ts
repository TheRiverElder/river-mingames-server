import City from "./City";
import IndustrySlot from "./IndustrySlot";
import Link from "./Link";
import Profile from "./Profile";
import Action from "./action/Action";
import { Nullable } from "../libs/lang/Optional";
import GameDynamicData from "./communication/GameDynamicData";
import GameStaticData from "./communication/GameStaticData";
import { int, Pair, Predicator } from "../libs/CommonTypes";
import Registry from "../libs/management/Registry";
import MerchantSlot from "./MerchantSlot";
import { Era, Resources } from "./Constants";
import FactorySlot from "./FactorySlot";
import FactoryPattern from "./FactoryPattern";
import ObservableRegistry from "../libs/management/ObservableRegistry";
import { computeIfAbsent } from "../libs/lang/Collections";

export default class Game {
    readonly actions = new Registry<string, Action>(it => it.name);

    readonly factoryPatterns = new Registry<int, FactoryPattern>(it => it.uid);
    readonly cities = new Registry<string, City>(it => it.name);
    readonly factorySlots = new ObservableRegistry<int, FactorySlot>(it => it.uid);
    readonly industrySlots = new ObservableRegistry<int, IndustrySlot>(it => it.uid);
    readonly merchantSlots = new ObservableRegistry<int, MerchantSlot>(it => it.uid);
    readonly links = new ObservableRegistry<int, Link>(it => it.uid);
    readonly profiles = new Registry<number, Profile>(it => it.uid); 
    era: Era = "canal";
    currentOrdinal: number = 0;

    constructor() {
        this.factorySlots.onAddListeners.add(fs => computeIfAbsent(fs.owner.factorySlots, fs.pattern.industry, () => [])[fs.pattern.level] = fs);
        this.industrySlots.onAddListeners.add(it => it.city.industrySlots.push(it));
        this.merchantSlots.onAddListeners.add(it => it.city.merchantSlots.push(it));
        this.links.onAddListeners.add(link => link.getEnds().forEach(city => city.links.push(link)));
        // TODO remove logic
    }

    getStaticData(): GameStaticData {
        // TODO
        throw new Error();
    }

    getDynamicData(): GameDynamicData {
        // TODO
        throw new Error();
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
        return game;
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