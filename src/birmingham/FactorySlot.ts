
export default class FactorySlot {
    readonly costs: Array<[string, number]>;
    amount: number = 0;

    constructor(costs: Array<[string, number]>, amount: number = 0) {
        this.costs = costs;
        this.amount = amount;
    }
}