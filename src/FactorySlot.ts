import City from "./City";
import Factory from "./Factory";

export default class FactorySlot {
    readonly city: City;
    readonly costs: Array<[string, number]>;
    readonly factories: Array<Factory> = [];

    constructor(city: City, costs: Array<[string, number]>) {
        this.city = city;
        this.costs = costs;
    }
}