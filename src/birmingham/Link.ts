import { Nullable } from "../libs/lang/Optional";
import City from "./City";
import { Era } from "./Constants";
import Game from "./Game";
import Profile from "./Profile";

export default class Link {
    readonly uid: number;
    readonly head: City;
    readonly tail: City;
    readonly eras: Array<Era>;
    owner: Nullable<Profile> = null;

    constructor(uid: number, head: City, tail: City, eras: Array<Era>) {
        this.uid = uid;
        this.head = head;
        this.tail = tail;
        this.eras = eras;
    }

    save(): any {
        return {
            uid: this.uid,
            head: this.head.name,
            tail: this.tail.name,
            eras: this.eras,
            owner: this.owner?.uid || null,
        };
    }
    
    static load(data: any, game: Game): Link {
        const link = new Link(
            data.uid,
            game.cities.getOrThrow(data.head),
            game.cities.getOrThrow(data.tail),
            data.eras,
        );
        link.owner = data.owner === null ? null : game.profiles.getOrThrow(data.owner);
        return link;
    }

    getOtherEnd(end: City) {
        if (end === this.head) return this.tail;
        if (end === this.tail) return this.head;
        throw new Error(`City ${end.name} is not in this link(${this.head.name}, ${this.tail.name})`);
    }

    isLinkOf(end1: City, end2: City) {
        return (end1 === this.head && end2 === this.tail) || (end1 === this.tail && end2 === this.head);
    }

    connectedCity(city: City) {
        return city === this.head || city === this.tail;
    }

    getEnds() {
        return [this.head, this.tail];
    }

    get built(): boolean {
        return !!this.owner;
    }
}