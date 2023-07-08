import { Nullable } from "../libs/lang/Optional";
import FactoryPattern from "./FactoryPattern";
import FactorySlot from "./FactorySlot";
import Game from "./Game";
import Profile from "./Profile";

export default class Factory {
    readonly pattern: FactoryPattern;
    readonly owner: Profile;
    resources: Nullable<[string, number]>;
    sold: boolean = false;

    constructor(pattern: FactoryPattern, owner: Profile, resources: Nullable<[string, number]> = null) {
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
}