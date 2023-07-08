import City from "./City";
import IndustrySlot from "./IndustrySlot";
import Link from "./Link";
import Profile from "./Profile";
import Action from "./action/Action";
import { Nullable } from "../libs/lang/Optional";
import GameDynamicData from "./communication/GameDynamicData";
import GameStaticData from "./communication/GameStaticData";
import { int, Predicator } from "../libs/CommonTypes";
import Registry from "../libs/management/Registry";
import MerchantSlot from "./MerchantSlot";
import { Era } from "./Constants";
import FactorySlot from "./FactorySlot";
import FactoryPattern from "./FactoryPattern";

export default class Game {
    readonly actions = new Registry<string, Action>(it => it.name);

    readonly profiles = new Registry<number, Profile>(it => it.uid); 
    readonly cities = new Registry<string, City>(it => it.name);
    readonly industrySlots = new Registry<int, IndustrySlot>(it => it.uid);
    readonly merchantSlots = new Registry<int, MerchantSlot>(it => it.uid);
    readonly factorySlots = new Registry<int, FactorySlot>(it => it.uid);
    readonly factoryPatterns = new Registry<int, FactoryPattern>(it => it.uid);
    readonly links = new Registry<int, Link>(it => it.uid);
    era: Era = "canal";
    currentOrdinal: number = 0;

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
            profiles: this.profiles.values().map(it => it.save()),
            citie: this.cities.values().map(it => it.save()),
            industrySlots: this.industrySlots.values().map(it => it.save()),
            merchantSlots: this.merchantSlots.values().map(it => it.save()),
            links: this.links.values().map(it => it.save()),
            factorySlots: this.factorySlots.values().map(it => it.save()),
            factoryPatterns: this.factoryPatterns.values().map(it => it.save()),
            era: this.era,
            currentOrdinal: this.currentOrdinal,
        };
    }

    static load(data: any): Game {
        const game = new Game();
        data.profiles.forEach(it => game.profiles.add(Profile.load(it)));
        // TODO
        return game;
    }

    getLink(end1: City, end2: City): Nullable<Link> {
        return this.links.values().find(link => link.isLinkOf(end1, end2)) || null;
    }

    getLinksOf(city: City): Array<Link> {
        return this.links.values().filter(link => link.connectedCity(city));
    }
    
    findIndustrySlot(predicate: Predicator<IndustrySlot>, config?: NetworkSearchingConfig): Nullable<IndustrySlot> {

        const profile: Nullable<Profile> = config?.profile || null; 
        const startCities: Array<City> = config?.startCities || []; 
        const pseudoLinks: Array<Link> = config?.pseudoLinks || []; 

        if (startCities.length === 0) {
            const cancidates = this.industrySlots.values().filter(city => predicate(city));
            if (cancidates.length === 0) return null;
            if (profile) return cancidates.find(it => it.city.isInNetworkOf(profile)) || null;
            else return cancidates[0];
        }


        for (const city of startCities) {
            const visitedCities = new Set<City>([city]);
            const queue: Array<City> = [city];

            while (queue.length > 0) {
                const city = queue.shift()!;

                const slot = city.industrySlots.find(it => predicate(it));
                if (slot) return slot;

                let nextCities = [...this.getLinksOf(city), ...pseudoLinks.filter(it => it.connectedCity(city))]
                    .map(link => link.getOtherEnd(city))
                    .filter(city => !visitedCities.has(city));
                if (profile) {
                    nextCities = nextCities.filter(city => city.isInNetworkOf(profile));
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