import Factory from "./Factory";
import Profile from "./Profile";

export default class FactorySlot {
    readonly industry: string;
    readonly owner: Profile;
    readonly costs: Array<[string, number]>;
    readonly awards: Array<[string, number]>;
    amount: number = 0;

    constructor(industry: string, costs: Array<[string, number]>, awards: Array<[string, number]>, amount: number = 0) {
        this.industry = industry;
        this.costs = costs;
        this.awards = awards;
        this.amount = amount;
    }

    createFactory(): Factory {
        return new Factory(this, this.owner);
    }
}