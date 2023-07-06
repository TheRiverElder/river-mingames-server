import Profile from "./Profile";
import { Nullable } from "./lang";

export default class Factory {
    readonly industry: string;
    readonly owner: Profile;
    readonly awards: Array<[string, number]>;
    resources: Nullable<[string, number]>;
    sold: boolean = false;

    constructor(industry: string, owner: Profile, awards: Array<[string, number]>, resources: Nullable<[string, number]> = null) {
        this.industry = industry;
        this.owner = owner;
        this.awards = awards;
        this.resources = resources;
    }
}