import { CITIES_ARGS } from "./CommonData";
import Game from "./Game"
import Loan from "./action/Loan";
import Build from "./action/Build";
import Develop from "./action/Develop";
import Network from "./action/Network";
import Scout from "./action/Scout";
import Sell from "./action/Sell";
import { FACTORY_PATTERNS, STATIC_DATA_RAW_CITY, STATIC_DATA_RAW_CITY_SLOT, STATIC_DATA_RAW_LINKS } from "./builtin/StaticDataRaw";
import { double, int, Pair } from "../libs/CommonTypes";
import City from "./City";
import { Era, Resources } from "./Constants";
import Market from "./Market";
import IndustrySlot from "./IndustrySlot";
import MerchantSlot from "./MerchantSlot";
import Link from "./Link";
import { Nullable } from "../libs/lang/Optional";
import Profile from "./Profile";
import { createArray } from "../libs/lang/Collections";
import { shuffle } from "../libs/math/Mathmatics";

export default function createGame(playerAmount: number): Game {
    const game = new Game();

    game.actions.add(new Build());
    game.actions.add(new Develop());
    game.actions.add(new Loan());
    game.actions.add(new Network());
    game.actions.add(new Scout());
    game.actions.add(new Sell());

    game.markets.set(Resources.COAL, new Market(8, 13));
    game.markets.set(Resources.IRON, new Market(5, 8));

    {
        game.factoryPatterns.addAll(FACTORY_PATTERNS);
    }

    {
        const table = STATIC_DATA_RAW_CITY.trim().split("\n").map(line => line.split("\t"));
        for (const [name, type, merchantBonusType, merchantBonusAmountString] of table) {
            const merchantBonus: Nullable<Pair<string, int>> = (merchantBonusType) ? [merchantBonusType, parseInt(merchantBonusAmountString)] : null;
            game.cities.add(new City(name, type as any, game.markets.get(Resources.COAL), merchantBonus as any));
        }
    }

    {
        const table = STATIC_DATA_RAW_CITY_SLOT.trim().split("\n").map(line => line.split("\t"));
        for (const [uidString, cityName, type, indexString, xString, yString, industriesString] of table) {
            const uid = parseInt(uidString);
            const city: City = game.cities.getOrThrow(cityName);
            const index = parseInt(indexString);
            const position = [parseFloat(xString), parseFloat(yString)] as Pair<double, double>;
            const industries = industriesString.split(",");

            switch (type) {
                case "industry": game.industrySlots.add(new IndustrySlot(uid, position, city, industries)); break;
                case "merchant": game.merchantSlots.add(new MerchantSlot(uid, position, city, industries)); break;
            }
        }
    }

    {
        const table = STATIC_DATA_RAW_LINKS.trim().split("\n").map(line => line.split("\t"));
        for (const [uidString, headName, tailName, xString, yString, erasString] of table) {
            const uid = parseInt(uidString);
            const head: City = game.cities.getOrThrow(headName);
            const tail: City = game.cities.getOrThrow(tailName);
            const position = [parseFloat(xString), parseFloat(yString)] as Pair<double, double>;
            const eras = erasString.split(",") as Array<Era>;

            game.links.add(new Link(uid, position, head, tail, eras));
        }
    }

    const cards = shuffle(createCards(playerAmount));

    const cardAmountPerPlayer = cards.length / roundAmountByPlayerAmount[playerAmount - 2];

    for (let index = 0; index < playerAmount; index++) {
        const uid = 16 + index;
        const profile = new Profile(uid);
        game.profiles.add(profile);
        profile.cards = cards.splice(0, cardAmountPerPlayer);
    }

    game.initializeProfileStates();

    return game;
}

const roundAmountByPlayerAmount: Array<int> = [10, 9, 8];

const cardStrategy: Array<[string, Array<int>]> = [
    ["belper", [0, 0, 2]],
    ["derby", [0, 0, 3]],
    ["leek", [0, 2, 2]],
    ["stoke_on_trent", [0, 3, 3]],
    ["stone", [0, 2, 2]],
    ["uttoxeter", [0, 1, 2]],
    ["stafford", [2, 2, 2]],
    ["burton_on_trent", [2, 2, 2]],
    ["cannock", [2, 2, 2]],
    ["tamworth", [1, 1, 1]],
    ["walsall", [1, 1, 1]],
    ["coalbrookdale", [3, 3, 3]],
    ["dudley", [2, 2, 2]],
    ["kidderminster", [2, 2, 2]],
    ["wolverhampton", [2, 2, 2]],
    ["worcester", [2, 2, 2]],
    ["birmingham", [3, 3, 3]],
    ["conventry", [3, 3, 3]],
    ["nuneaton", [1, 1, 1]],
    ["redditch", [1, 1, 1]],
    ["iron_works", [4, 4, 4]],
    ["coal_mine", [2, 2, 3]],
    ["cotton_mill_manufacturer", [0, 6, 8]],
    ["pottery", [2, 2, 3]],
    ["brewery", [5, 5, 5]],
];

function createCards(playerAmount: int): Array<string> {
    const index = playerAmount - 2;
    return cardStrategy.map(([card, amounts]) => createArray(amounts[index], () => card)).flat(1);
}