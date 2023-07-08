import { int, Pair } from "../../libs/CommonTypes";

// 以下数据结构只是用于客户端绘制地图，并提供必要的标识符，不用于直接计算

export interface MapItemData {
    uid: int;
    group: "merchant" | "industry" | "link";
    position: Pair<number, number>; // 相对于4000x4000的地图
}

export interface MapItemGroupData {
    name: string;
    size: Pair<number, number>; // 相对于4000x4000的地图
}

export default interface MapData {
    items: Array<MapItemData>;
    groups: Array<MapItemGroupData>;
}