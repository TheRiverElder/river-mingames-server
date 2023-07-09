import { Nullable } from "../libs/lang/Optional";
import { Industries } from "./Constants";

const { IRON_WORKS, COAL_MINE, BREWERY, CUTTON_MILL, MANUFACTURER, POTTERY } = Industries;

export const CITIES_ARGS: Array<[Nullable<string>, Array<Array<string>>]> = [
    ["birmingham", [
        [IRON_WORKS],
        [MANUFACTURER],
        [CUTTON_MILL, MANUFACTURER],
        [MANUFACTURER],
    ]],
    ["nuneaton", [
        [MANUFACTURER, BREWERY],
        [CUTTON_MILL, COAL_MINE],
    ]],
    ["coventry", [
        [MANUFACTURER, COAL_MINE],
        [IRON_WORKS, MANUFACTURER],
        [POTTERY],
    ]],
    ["redditch", [
        [MANUFACTURER, COAL_MINE],
        [IRON_WORKS],
    ]],
    ["worcester", [
        [CUTTON_MILL],
        [CUTTON_MILL],
    ]],
    ["kidderminster", [
        [CUTTON_MILL, COAL_MINE],
        [CUTTON_MILL],
    ]],
    ["dudley", [
        [COAL_MINE],
        [IRON_WORKS],
    ]],
    ["coalbrookdale", [
        [IRON_WORKS],
        [COAL_MINE],
        [IRON_WORKS, BREWERY],
    ]],
    ["wolverhampton", [
        [MANUFACTURER],
        [MANUFACTURER, COAL_MINE],
    ]],
]; 