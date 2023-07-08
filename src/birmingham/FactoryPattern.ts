import { int } from "../libs/CommonTypes";

export default class FactoryPattern {
    readonly uid: int;
    readonly industry: string;
    readonly level: int;
    readonly costs: Array<[string, number]>;
    readonly awards: Array<[string, number]>;

    constructor(uid: int, industry: string, level: int, costs: Array<[string, number]>, awards: Array<[string, number]>, amount: number = 0) {
        this.uid = uid;
        this.industry = industry;
        this.level = level;
        this.costs = costs;
        this.awards = awards;
    }

    save(): any {
        return {
            uid: this.uid,
            industry: this.industry,
            level: this.level,
            costs: this.costs,
            awards: this.awards,
        };
    }
    
    static load(data: any): FactoryPattern {
        return new FactoryPattern(
            data.uid,
            data.industry, 
            data.level, 
            data.costs,
            data.awards,
        );
    }
}