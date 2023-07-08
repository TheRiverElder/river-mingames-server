import City from "../City";
import { CITY_CARD_LIST, Industry } from "../Constants";
import Game from "../Game";
import Profile from "../Profile";
import { Location } from "../Types";
import Action from "./Action";

export default class Build implements Action {

    get name(): string { return "build"; }

    canUseCard(card: string, game: Game, profile: Profile): boolean {
        // TODO
        return true;
    }

    getValidIndustrySlotLocations(args: any, game: Game, profile: Profile): Array<City> {
        const card: string = args.card;

        const result: Array<City> = [];
        for (const city of Array.from(game.cities.values())) {
            
            for(const slot of city.industrySlots) {
                const factory = slot.factory;
                if (!factory || factory.owner !== profile) continue;
                break;
            }
        }

        return result;
    }

    act(args: any, game: Game, profile: Profile) {
        const card: string = args.card;
        const industrySlot = game.industrySlots.getOrThrow(args.industrySlot);
        const industry: Industry = args.industry;

        if (industrySlot.factory) throw new Error(`该位置已有工厂`);

        const isCityCard = CITY_CARD_LIST.indexOf(card) >= 0 || card === "wild";
        if (isCityCard && card !== "wild" && industrySlot.city.name !== card) throw new Error(`城市不符合`);

        if (profile.hasNetWork(game)) {
            if (!profile.isCityConnected(game, city)) throw new Error(`Cannot build, reason.`);
        }

        
        const factorySlot = profile.getValidFactorySlot(industry);
        if (!factorySlot) throw new Error(`没有剩余工厂${industry}}`);

        const factory = factorySlot.createFactory();
        factorySlot.amount--;

        if (industrySlot.canAcceptFactory(factory)) throw new Error(`工厂类型不符合`);

        profile.pay(game, factory.pattern.costs);
        industrySlot.factory = factory;
    }
}