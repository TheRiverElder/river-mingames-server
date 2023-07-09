export const CITY_CARD_LIST = [
    "wild",
    "belper",
    "birmingham",
    "burton_upon_trent",
    "cannock",
    "coalbrookdale",
    "coventry",
    "derby",
    "kidderminster",
    "leek",
    "nuneaton",
    "redditch",
    "stafford",
    "stoke_on_trent",
    "stone",
    "tamworth",
    "uttoxeter",
    "walsall",
    "wolverhampton",
    "worcester",
];

export const INDUSTRY_CARD_LIST = [
    "any",
    "coal_mine",
    "iron_works",
    "brewery",
    "pottery",
    "cutton_mill_manufacturer",
    "manufacturer_cutton_mill",
    "manufacturer_cutton_mill_2",
];

export const CARD_LIST = [...CITY_CARD_LIST, ...INDUSTRY_CARD_LIST];

export type Industry = "any" | "coal_mine" | "iron_works" | "brewery" | "pottery" | "cutton_mill" | "manufacturer";

export const Industries = {
    ANY: "any" as Industry,
    COAL_MINE: "coal_mine" as Industry,
    IRON_WORKS: "iron_works" as Industry,
    BREWERY: "brewery" as Industry,
    POTTERY: "pottery" as Industry,
    COTTON_MILL: "cutton_mill" as Industry,
    MANUFACTURER: "manufacturer" as Industry,
}

export const INDUSTRY_LIST = Array.from(Object.values(Industries));

export type Resource = "iron" | "coal" | "beer" | "coin" | "income_point" | "network_goal" | "factory_goal";

export const Resources = {
    IRON: "iron" as Resource,
    COAL: "coal" as Resource,
    BEER: "beer" as Resource,
    COIN: "coin" as Resource,
    INCOME_POINT: "income_point" as Resource,
    NETWORK_GOAL: "network_goal" as Resource,
    FACTORY_GOAL: "factory_goal" as Resource,
};

export const RESOURCE_LIST = Array.from(Object.values(Resources));

export type Era = "canal" | "rail" | "end";

export const Eras = {
    CANAL: "canal" as Era,
    RAIL: "rail" as Era,
};

export const ERA_LIST = Array.from(Object.values(Eras));