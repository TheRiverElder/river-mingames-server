import City from "./City";
import Profile from "./Profile";
import { Nullable } from "./lang";

export default class Link {
    readonly head: City;
    readonly tail: City;
    owner: Nullable<Profile> = null;

    constructor(head: City, tail: City) {
        this.head = head;
        this.tail = tail;
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
}