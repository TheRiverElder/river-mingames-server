import { int } from "../libs/CommonTypes";
import City from "./City";
import Game from "./Game";

export default class MerchantSlot {
    readonly uid: int;
    readonly city: City;
    readonly industries: Array<string>;
    bonusBeer: boolean = false;

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
            bonusBeer: this.bonusBeer,
        };
    }
    
    static load(data: any, game: Game): MerchantSlot {
        const slot = new MerchantSlot(
            data.uid,
            game.cities.getOrThrow(data.city),
            data.industries,
        );
        slot.bonusBeer = data.bonusBeer;
        return slot;
    }
}