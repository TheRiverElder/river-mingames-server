import { int } from "../../libs/CommonTypes";
import { Industry } from "../Constants";

export default interface GameStaticData {
    cities: Array<CityData>;
    industrySlots: Array<CitySlotData>;
    merchantSlots: Array<CitySlotData>;
    factorySlots: Array<FactorySlotData>;
}

export interface CityData {
    name: string;
    hasCoalMarket: boolean;
}

export interface CitySlotData {
    uid: int;
    city: string;
    index: int;
}

export interface FactorySlotData {
    uid: int;
    industry: Industry;
    owner: int;
    level: int;
}