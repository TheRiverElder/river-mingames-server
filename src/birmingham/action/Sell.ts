import { Resources } from "../Constants";
import Game from "../Game";
import Profile from "../Profile";
import Action from "./Action";
import { Location } from "../Types";

export default class Sell implements Action {

    get name(): string { return "sell"; }

    canUseCard(card: string, game: Game, profile: Profile) {
        return true;
    }

    act(args: any, game: Game, profile: Profile) {
        const records: Array<[number, number, number, number, number, number]> = args.records;
        for (const [sourceCityUid, industrySlotIndex, marketCityUid, merchantIndex, beerCityUid, beerIndustrySlotIndex] of records) {
            const sourceCity = game.cities.get(sourceCityUid);
            if (!sourceCity) throw new Error(`Cannot sell, source city ${sourceCityUid} not found.`);
            const sourceFactory = sourceCity.industrySlots[industrySlotIndex]?.factory;
            if (!sourceFactory) throw new Error(`Cannot sell, source factory at ${sourceCity.name} [${industrySlotIndex}] not found.`);
            const merchantCity = game.cities.get(marketCityUid);
            if (!merchantCity) throw new Error(`Cannot sell, merchant city #${marketCityUid} not found.`);
            const merchant = merchantCity.merchants[merchantIndex];
            if (!merchant) throw new Error(`Cannot sell, merchant #${merchantIndex} in city #${marketCityUid} not found.`);

            if (sourceFactory.sold) throw new Error(`Cannot sell, factory has been sold.`);

            // 消耗啤酒
            // TODO 只消耗了一个，记得改成根据工厂需求消耗
            if (!merchant.beerConsumed) {
                merchant.beerConsumed = true;
                if (merchantCity.merchantBonus) {
                    // TODO
                    merchantCity.merchantBonus();
                }
            } else {
                const beerCity = game.cities.get(beerCityUid);
                if (!beerCity) throw new Error(`Cannot sell, beer city #${marketCityUid} not found.`);
                const beerFactory = beerCity.industrySlots[beerIndustrySlotIndex]?.factory;
                if (!beerFactory) throw new Error(`Cannot sell, beer factory #${merchantIndex} in city #${marketCityUid} not found.`);
                
                const beerResources = beerFactory.resources;
                if (!beerResources) throw new Error(`Cannot sell, beer resources not found.`);
                if (beerResources[0] !== Resources.BEER) throw new Error(`Cannot sell, beer resources on selected factory not found.`);
                if (beerResources[1] <= 0) throw new Error(`Cannot sell, beer resources on selected factory not enough.`);

                beerResources[1]--;
                if (beerResources[1] <= 0) {
                    beerFactory.resources = null;
                }
            }
            
            if (merchant.industries.indexOf(sourceFactory.pattern.industry) < 0) throw new Error(`Cannot sell, source resources is not acceptable.`);

            sourceFactory.sold = true;
            profile.gain(sourceFactory.pattern.awards);
        }

    }
}

function getIndustrySlot(game: Game, location: Location) {

}

function getIndustryMerchant(game: Game, location: Location) {

}