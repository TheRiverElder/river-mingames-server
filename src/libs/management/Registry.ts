import { Productor } from "../CommonTypes";
import { isEmpty } from "../lang/Objects";
import Optional from "../lang/Optional";

const DEFAULT_ERROR_THROWER: Productor<any, Error> = (key) => Error("Cannot find key: " + key)

export default class Registry<K, V> {

    private keyGetter: Productor<V, K>;
    protected map = new Map<K, V>();

    constructor(keyGetter: Productor<V, K>) {
        this.keyGetter = keyGetter;
    }

    addAll(values: Array<V>): Set<V> {
        const succeeded = new Set<V>();
        for (const value of values) {
            if (this.add(value)) succeeded.add(value);
        }
        return succeeded;
    }

    add(value: V): boolean {
        const key = this.keyGetter(value);
        if (this.map.has(key)) return false;
        this.map.set(key, value);
        return true;
    }

    remove(value: V): boolean {
        const key = this.keyGetter(value);
        if (!this.map.has(key)) return false;
        this.map.delete(key);
        return true;
    }

    removeByKey(key: K): boolean {
        if (!this.map.has(key)) return false;
        this.map.delete(key);
        return true;
    }

    getOrThrow(key: K, errorThrower: Productor<K, Error> = DEFAULT_ERROR_THROWER): V {
        const value = this.map.get(key);
        if (isEmpty(value)) throw errorThrower(key);
        return value as V;
    }

    get(key: K): Optional<V> {
        return Optional.ofNullable(this.map.get(key) || null);
    }

    keys() {
        return Array.from(this.map.keys());
    }

    values() {
        return Array.from(this.map.values());
    }

    entries() {
        return Array.from(this.map.entries());
    }

    size() {
        return this.map.size;
    }

}