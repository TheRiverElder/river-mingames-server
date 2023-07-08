import { int, Productor } from "../CommonTypes";
import { isEmpty } from "./Objects";
import { Nullable } from "./Optional";

export function computeIfAbsent<K, V>(map: Map<K, V>, key: K, getValue: () => V): V {
    let value = map.get(key);
    if (!value) {
        value = getValue();
        map.set(key, value);
    }
    return value;
}

export function mutate<K, V>(map: Map<K, V>, key: K, getValue: () => V , mutate: (value: V) => V): V {
    let value = map.get(key);
    if (!value) {
        value = getValue();
    }
    map.set(key, mutate(value));
    return value;
}

export function createArray<T>(length: int, generateElement: (index: int) => T): Array<T> {
    const array = Array<T>(length);
    for (let index = 0; index < array.length; index++) {
        array[index] = generateElement(index);
    }
    return array;
}

export function filterNotNull<T>(array: Array<T | null>): Array<T> {
    const result: Array<T> = [];
    for (const element of array) {
        if (element === null) continue;
        result.push(element);
    }
    return result;
}

export function removeFromArray<T>(array: Array<T>, element: T): boolean {
    const index = array.indexOf(element);
    if (index < 0) return false;
    array.splice(index, 1);
    return true;
}

export function groupBy<T, G>(array: Array<T>, grouper: Productor<T, G>): Map<G, Array<T>> {
    const groups: Map<G, Array<T>> = new Map();
    for (const element of array) {
        const groupType = grouper(element);
        const group = computeIfAbsent(groups, groupType, () => []);
        group.push(element);
    }
    return groups;
}

export function clearArray<T>(array: Array<T>) {
    array.splice(0, array.length);
}

export function sumBy<T>(array: Array<T>, valueGetter: Productor<T, number>): number {
    return array.reduce((sum, element) => sum + valueGetter(element), 0);
}

export function sum(array: Array<number>): number {
    return array.reduce((sum, element) => sum + element, 0);
}

export function average(array: Array<number>): number {
    if (array.length === 0) return 0;
    return sum(array) / array.length;
}

export function minBy<T>(array: Array<T>, featureGetter: Productor<T, number>): T {
    let minElement: Nullable<T> = null;
    let minFeature = Number.POSITIVE_INFINITY;
    for (const element of array) {
        const feature = featureGetter(element);
        if (minElement === null || feature < minFeature) {
            minElement = element;
            minFeature = feature;
        }
    }
    if (minElement === null) throw new Error("Cannot minBy am empty array");
    return minElement;
}

export function maxBy<T>(array: Array<T>, featureGetter: Productor<T, number>): T {
    let maxElement: Nullable<T> = null;
    let maxFeature = Number.NEGATIVE_INFINITY;
    for (const element of array) {
        const feature = featureGetter(element);
        if (maxElement === null || feature > maxFeature) {
            maxElement = element;
            maxFeature = feature;
        }
    }
    if (maxElement === null) throw new Error("Cannot minBy am empty array");
    return maxElement;
}

export function peek<T>(array: Array<T>): T {
    return array[array.length - 1];
}

export function peekNullable<T>(array: Array<T>): Nullable<T> {
    const value = array[array.length - 1];
    if (isEmpty(value)) return null;
    return value;
}