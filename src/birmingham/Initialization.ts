import { CITIES_ARGS } from "./CommonData";
import Game from "./Game"
import Loan from "./action/Loan";
import Build from "./action/Build";
import Develop from "./action/Develop";
import Network from "./action/Network";
import Scout from "./action/Scout";
import Sell from "./action/Sell";
import { STATIC_DATA_RAW_CITY, STATIC_DATA_RAW_CITY_SLOT, STATIC_DATA_RAW_LINKS } from "./builtin/StaticDataRaw";
import { double, int, Pair } from "../libs/CommonTypes";
import City from "./City";
import { Era, Resources } from "./Constants";
import Market from "./Market";
import IndustrySlot from "./IndustrySlot";
import MerchantSlot from "./MerchantSlot";
import Link from "./Link";
import { Nullable } from "../libs/lang/Optional";
import Profile from "./Profile";

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

    for (let index = 0; index < playerAmount; index++) {
        const uid = 16 + index;
        game.profiles.add(new Profile(uid));
    }

    game.initializeProfileStates();

    return game;
}