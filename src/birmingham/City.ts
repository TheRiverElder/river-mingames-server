import { int, Pair } from "../libs/CommonTypes";
import { Nullable } from "../libs/lang/Optional";
import { Resource } from "./Constants";
import IndustrySlot from "./IndustrySlot";
import Link from "./Link";
import Market from "./Market";
import MerchantSlot from "./MerchantSlot";
import Profile from "./Profile";

export default class City {
    readonly name: string;
    readonly type: "industry" | "merchant";
    readonly industrySlots: Array<IndustrySlot>;
    readonly merchantSlots: Array<MerchantSlot>;
    readonly links: Array<Link> = [];
    readonly market: Nullable<Market>;
    readonly merchantBonus: Nullable<Pair<Resource, int>>;

    constructor(name: string, type: "industry" | "merchant", market: Nullable<Market> = null, merchantBonus: Nullable<Pair<Resource, int>> = null) {
        this.name = name;
        this.type = type;
        this.market = market;
        this.merchantBonus = merchantBonus;
    }

    save(): any {
        return {
            name: this.name,
            type: this.type,
            merchantBonus: this.merchantBonus,
            // industrySlots 不保存在此
            // merchantSlots 不保存在此
            // market 不保存在此
            // links 不保存在此
        };
    }
    
    static load(data: any): City {
        return new City(
            data.name,
            data.type,
            data.merchantBonus,
        );
    }

    hasFactoryOf(profile: Profile): boolean {
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