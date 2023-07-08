import { int } from "../libs/CommonTypes";
import Factory from "./Factory";
import FactoryPattern from "./FactoryPattern";
import Game from "./Game";
import Profile from "./Profile";

export default class FactorySlot {
    readonly uid: int;
    readonly pattern: FactoryPattern;
    readonly owner: Profile;
    amount: number = 0;

    constructor(uid: int, pattern: FactoryPattern, owner: Profile, amount: number = 0) {
        this.uid = uid;
        this.pattern = pattern;
        this.owner = owner;
        this.amount = amount;
    }

    save(): any {
        return {
            uid: this.uid,
            pattern: this.pattern.uid,
            owner: this.owner.uid,
            amount: this.amount,
        };
    }
    
    static load(data: any, game: Game): FactorySlot {
        const slot = new FactorySlot(
            data.uid,
            game.factoryPatterns.getOrThrow(data.pattern),
            game.profiles.getOrThrow(data.owner),
            data.amount,
        );
        slot.amount = data.amount;
        return slot;
    }

    createFactory(): Factory {
        return new Factory(this, this.owner);
    }
}