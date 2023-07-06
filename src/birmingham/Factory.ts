import FactorySlot from "./FactorySlot";
import Profile from "./Profile";
import { Nullable } from "./lang";

export default class Factory {
    readonly pattern: FactorySlot;
    readonly owner: Profile;
    resources: Nullable<[string, number]>;
    sold: boolean = false;

    constructor(pattern: FactorySlot, owner: Profile, resources: Nullable<[string, number]> = null) {
        this.pattern = pattern;
        this.owner = owner;
        this.resources = resources;
    }
}