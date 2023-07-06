import IndustrySlot from "./IndustrySlot";
import Market from "./Market";
import Merchant from "./Merchant";
import Profile from "./Profile";
import { Nullable } from "./lang";

export default class City {
    readonly uid: number;
    readonly name: Nullable<string>;
    readonly industrySlots: Array<IndustrySlot>;
    readonly market: Nullable<Market>;
    readonly merchants: Array<Merchant>;
    readonly merchantBonus: Nullable<Function>;

    constructor(uid: number, name: Nullable<string> = null, market: Nullable<Market> = null, merchants: Array<Merchant> = [], merchantBonus: Nullable<Function> = null) {
        this.uid = uid;
        this.name = name;
        this.market = market;
        this.merchants = merchants;
        this.merchantBonus = merchantBonus;
    }

    isInNetworkOf(profile: Profile): boolean {
        return this.industrySlots.some(slot => slot.factory && slot.factory.owner === profile);
    }

    hasResource(resourceType: string): boolean {
        return this.industrySlots.some(slot => slot.factory && slot.factory.resources?.[0] === resourceType && slot.factory.resources[1] > 0);
    }

    getIndustrySlotWithResource(resourceType: string, owner: Nullable<Profile> = null): Nullable<IndustrySlot> {
        return this.industrySlots
            .find(slot => slot.factory 
                && (!!owner && slot.factory.owner === owner)
                && slot.factory.resources?.[0] === resourceType 
                && slot.factory.resources[1] > 0) 
                || null;
    }
}