import { int } from "../CommonTypes";
import { createArray } from "../lang/Collections";
import { interpolate } from "./Mathmatics";

// r, g, b 均在[0, 1]内
export type RGB = [number, number, number];

export function rgbFromInt(value: int): RGB {
    return [
        (value >>> 16) & 0xff,
        (value >>> 8) & 0xff,
        value & 0xff,
    ].map(it => it / 0xff) as RGB;
}

export function styleColorRgb(rgb: RGB): string {
    return '#' + rgb.slice(0, 3).map(c => Math.round(c * 0xff).toString(16).padStart(2, '0')).join('');
}

export function interpolateRgb(startRGB: RGB, endRGB: RGB, ratio: number): RGB {
    return createArray(3, i => interpolate(startRGB[i], endRGB[i], ratio)) as RGB;
}