import { int } from "../CommonTypes";

export function repeatString(str: string, amount: int): string {
    return Array(amount).fill(str).join("");
}

export function repeatRun(fn: Function, amount: int) {
    for (let i = 0; i < amount; i++) {
        fn();
    }
}

export function readableNumber(num: number): string {
    if (Number.isInteger(num)) return num.toString();
    return num.toFixed(2);
}

export function capitalize(str: string): string {
    if (str.length === 0) return str;
    return str[0].toUpperCase() + str.slice(1);
}