import City from "../City";
import { CITY_CARD_LIST } from "../Constants";
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
        const [cityName, industrySlotIndex]: Location = args.location;
        const industry: string = args.industry;

        const isCityCard = CITY_CARD_LIST.indexOf(card) >= 0 || card === "wild";
        if (isCityCard && card !== "wild" && cityName !== card) throw new Error(`Cannot build, reason.`);

        const city = game.getCityByNmae(cityName)!;
        const industrySlot = city.industrySlots[industrySlotIndex]!;
        if (industrySlot.industries.indexOf(industry) < 0) throw new Error(`Cannot build, reason.`);
        if (industrySlot.factory) throw new Error(`Cannot build, reason.`);

        if (profile.hasNetWork(game)) {
            if (!profile.isCityConnected(game, city)) throw new Error(`Cannot build, reason.`);
        }

        
        const factorySlots = profile.factories.find(([industry]) => industry === industry)?.[1];
        if (!factorySlots) throw new Error(`Cannot build, reason.`);
        const factorySlot = factorySlots.find(slot => slot.amount > 0);
        if (!factorySlot) throw new Error(`Cannot build, reason.`);

        const factory = factorySlot.createFactory();
        factorySlot.amount--;
        if (!factory) throw new Error(`Cannot build, reason.`);

        profile.pay(game, factorySlot.costs);
        industrySlot.factory = factory;
    }
}