import { Pair } from "../CommonTypes";
import { sumBy } from "../lang/Collections";
import { Nullable } from "../lang/Optional";

export default class WeightedRandom<T = any> {
    protected readonly candicates: Array<Pair<T, number>>;

    constructor(candicates: Array<Pair<T, number>>) {
        this.candicates = candicates;
    }

    get total(): number {
        return sumBy(this.candicates, p => p[1]);
    }

    random(): T {
        if (this.candicates.length === 0) throw Error("No candicates!");
        const hit = Math.random() * this.total;
        let counter = 0;
        for (const [value, weight] of this.candicates) {
            counter += weight;
            if (hit <= counter) return value;
        }
        return this.candicates[this.candicates.length - 1][0];
    }

    randomWithNull(total: number): Nullable<T> {
        const hit = Math.random() * total;
        if (hit >= this.total) return null;
        let counter = 0;
        for (const [value, weight] of this.candicates) {
            counter += weight;
            if (hit <= counter) return value;
        }
        return null;
    }

    randomWithDefault(total: number, defaultValue: T): T {
        const hit = Math.random() * total;
        if (hit >= this.total) return defaultValue;
        let counter = 0;
        for (const [value, weight] of this.candicates) {
            counter += weight;
            if (hit <= counter) return value;
        }
        return defaultValue;
    }
}