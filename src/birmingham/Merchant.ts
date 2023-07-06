export default class Merchant {
    readonly industries: Array<string>;
    beerConsumed: boolean = false;

    constructor(industries: Array<string>) {
        this.industries = industries;
    }
}