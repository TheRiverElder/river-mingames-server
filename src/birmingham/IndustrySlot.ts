import City from "./City";
import Factory from "./Factory";
import { Nullable } from "./lang";

export default class IndustrySlot {
    readonly city: City;
    readonly industries: Array<string>;
    factory: Nullable<Factory> = null;

    constructor(city: City, industries: Array<string>) {
        this.city = city;
        this.industries = industries;
    }
}