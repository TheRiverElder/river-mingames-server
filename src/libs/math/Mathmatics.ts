import { int } from "../CommonTypes";

export const TWO_PI = 2 * Math.PI;

export function square(x: number): number {
    return x * x;
}

// result in (minimum, maximum]
export function rand(minimum: number, maximum: number): number {
    return (Math.random() * (maximum - minimum) + minimum);
}

// result in (minimum, maximum]
export function randInt(minimum: number, maximum: number): number {
    return Math.floor(rand(minimum, maximum));
}

export function checkLessThan(valve: number): boolean {
    return (Math.random() < valve);
}

export function randOne<T>(array: Array<T>): T {
    if (array.length === 0) throw new Error("Cannot get random from an empty array!");
    return array[randInt(0, array.length)];
}

export function randSome<T>(array: Array<T>, amount: int): Array<T> {
    if (array.length === 0) return [];
    const limit = Math.min(array.length, amount);
    const shadow: Array<T> = array.slice();
    for (let i = 0; i < limit; i++) {
        const j = randInt(i, limit);
        if (i === j) continue;
        const tmp = shadow[i];
        shadow[i] = shadow[j];
        shadow[j] = tmp;
    }
    return shadow.slice(0, amount);
}

export function randOneOrNull<T>(array: Array<T>): T | null {
    if (array.length === 0) return null;
    return array[randInt(0, array.length)];
}

export function constrains(value: number, minimum: number, maximum: number): number {
    return (value <= minimum) ? minimum : (value >= maximum ? maximum : value);
}

export function interpolate(startValue: number, endValue: number, ratio: number): number {
    return startValue + (endValue - startValue) * ratio;
}

export function allModulo(value: number, divisor: number): number {
    if (value >= 0) return value % divisor;
    const v = value + Math.ceil(Math.abs(value) / divisor) * divisor;
    return v % divisor;
}