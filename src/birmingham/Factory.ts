import { int } from "../libs/CommonTypes";
import { Nullable } from "../libs/lang/Optional";
import FactoryPattern from "./FactoryPattern";
import Game from "./Game";
import Profile from "./Profile";

export default class Factory {
    readonly pattern: FactoryPattern;
    readonly owner: Profile;
    resources: Nullable<[string, int]>;
    sold: boolean = false;

    constructor(pattern: FactoryPattern, owner: Profile, resources: Nullable<[string, int]> = null) {
        this.pattern = pattern;
        this.owner = owner;
        this.resources = resources;
    }

    save(): any {
        return {
            pattern: this.pattern.uid,
            owner: this.owner.uid,
            resources: this.resources,
            sold: this.sold,
        };
    }
    
    static load(data: any, game: Game): Factory {
        const factory = new Factory(
            game.factoryPatterns.getOrThrow(data.pattern), 
            game.profiles.getOrThrow(data.owner),
            data.resources,
        );
        factory.sold = data.sold;
        return factory;
    }

    consumeResources(type: string, amount: int) {
        if (!this.resources) throw new Error(`资源不足`);
        if (this.resources[0] !== type) throw new Error(`资源不匹配`);
        if (this.resources[1] <= amount) throw new Error(`资源不足`);
        this.resources[1] -= amount;
        if (this.resources[1] <= 0) {
            this.resources = null;
            this.sellOut();
        }
    }

    sellOut() {
        if (this.sold) throw new Error(`已经卖出，不可再卖`);
        this.sold = true;
        this.owner.gainAll(this.pattern.awards);
    }
}