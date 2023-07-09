import { Resources } from "../Constants";
import Game from "../Game";
import Profile from "../Profile";
import Action from "./Action";
import { int } from "../../libs/CommonTypes";

export default class Sell implements Action {

    get name(): string { return "sell"; }

    canUseCard(card: string, game: Game, profile: Profile) {
        return true;
    }

    act(args: any, game: Game, profile: Profile) {
        const records: Array<[int, int, Array<int>]> = args.records;
        for (const [sourceIndustrySlotUid, targetMerchantSlotUid, beerIndustrySlotUidList] of records) {
            const source = game.industrySlots.getOrThrow(sourceIndustrySlotUid);
            const target = game.merchantSlots.getOrThrow(targetMerchantSlotUid);
            const beerSlots = beerIndustrySlotUidList.map(uid => game.industrySlots.getOrThrow(uid));

            const factory = source.factory;
            if (!factory) throw new Error(`该位置不存在工厂`);
            if (factory.sold) throw new Error(`该工厂已被卖出`);

            // 消耗啤酒
            // TODO 只消耗了一个，记得改成根据工厂需求消耗
            let requiredBeerCount = factory.pattern.beerPrice;
            if (requiredBeerCount > 0 && target.bonusBeer) {
                target.bonusBeer = false;
                requiredBeerCount--;
                const bonus = target.city.merchantBonus;
                if (bonus) profile.gain(...bonus);
            }
            
            for (const beerSlot of beerSlots) {
                if (requiredBeerCount <= 0) break;
                else {
                    const brewery = beerSlot?.factory;
                    if (!brewery) throw new Error(`指定的啤酒厂不存在`);
    
                    const delta = Math.min(brewery.resources?.[1] || 0, requiredBeerCount);
                    brewery.consumeResources(Resources.BEER, delta);
                    requiredBeerCount - delta;
                }
            }

            factory.sellOut();
        }

    }
}