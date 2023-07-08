import { int } from "../libs/CommonTypes";
import { Nullable } from "../libs/lang/Optional";
import City from "./City";
import Factory from "./Factory";
import Game from "./Game";

export default class IndustrySlot {
    readonly uid: int;
    readonly city: City;
    readonly industries: Array<string>;
    factory: Nullable<Factory> = null;

    constructor(uid: int, city: City, industries: Array<string>) {
        this.uid = uid;
        this.city = city;
        this.industries = industries;
    }

    save(): any {
        return {
            uid: this.uid,
            city: this.city.name,
            industries: this.industries,
            factory: this.factory?.save() || null,
        };
    }
    
    static load(data: any, game: Game): IndustrySlot {
        const slot = new IndustrySlot(
            data.uid,
            game.cities.getOrThrow(data.city),
            data.industries,
        );
        slot.factory = data.factory === null ? null : Factory.load(data.factory, game);
        return slot;
    }
}