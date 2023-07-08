import { int, Pair } from "../../libs/CommonTypes";
import { Nullable } from "../../libs/lang/Optional";
import { Era, Resource } from "../Constants";

export default interface GameDynamicData {
    era: Era;
    currentOrdinal: int;
    profiles: Array<ProfileData>;
    links: Array<LinkData>;
    industrySlots: Array<IndustrySlotData>;
    merchantSlots: Array<MerchantSlotData>;
}

export interface ProfileData {
    uid: int;
    name: string;
    cards: Array<string>;
    preparingArea: Array<FactorySlotData>; // [Industry, factories]
    money: int;
    costCoinCounter: int;
    goals: int;
    incomePoints: int;
    incomeLevel: int;

    ordinal: int;
    actionCounter: int;
}

export interface FactorySlotData {
    amount: int;
}

export interface LinkData {
    uid: int;
    owner: Nullable<int>;
}

export interface IndustrySlotData {
    uid: int;
    factory: Nullable<FactoryData>;
}

export interface FactoryData {
    pattern: int;
    sold: boolean;
    resources: Nullable<Pair<Resource, int>>;
}

export interface MerchantSlotData {
    uid: int;
    bonusBeer: boolean;
}