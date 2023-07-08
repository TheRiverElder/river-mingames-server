import { double, int } from "../CommonTypes";

export function randomInt(minimum: int, maximum: int): int {
    return Math.floor(minimum + Math.random() * (maximum - minimum));
}

export function randomDouble(minimum: double, maximum: double): double {
    return minimum + Math.random() * (maximum - minimum);
}

export function randomElement<T>(array: Array<T>): T {
    return array[randomInt(0, array.length)];
}