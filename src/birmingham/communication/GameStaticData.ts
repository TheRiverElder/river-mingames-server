import { int } from "../../libs/CommonTypes";
import { Industry } from "../Constants";

export default interface GameStaticData {
    cities: Array<CityStaticData>;
    industrySlots: Array<CitySlotStaticData>;
    merchantSlots: Array<CitySlotStaticData>;
    factorySlots: Array<FactorySlotStaticData>;
}

export interface CityStaticData {
    name: string;
    hasCoalMarket: boolean;
}

export interface CitySlotStaticData {
    uid: int;
    city: string;
    index: int;
}

export interface FactorySlotStaticData {
    uid: int;
    industry: Industry;
    owner: int;
    level: int;
}