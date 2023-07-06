import Game from "./Game";
import Profile from "./Profile";
import IdleState from "./state/IdleState";

export class RpcRequestHandler {

    readonly game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    ["getState"](client: Profile) {
        if (this.game.currentOrdinal === client.ordinal) {
            return client.state;
        } else {
            return new IdleState();
        }
    }

    ["getWorldData"](client: Profile) {
        return {
            era: this.game.era,
            profiles: Array.from(this.game.profiles.values()).map(p => ({
                uid: p.uid,
                name: p.name,
                cards: p.cards.slice(),
                factories: p.factories.map(f => ([f[0], f[1].map(s => ({
                    cost: s.costs,
                    amount: s.amount,
                }))])),
                money: p.money,
                costCoinCounter: p.costCoinCounter,
                income: p.track.points,
                incomeLevel: p.track.getIncomeLevel(),
                goals: p.track.getGoal(),
            })), 
            cities: Array.from(this.game.cities.values()).map(city => ({
                uid: city.uid,
                name: city.name,
                industrySlots: city.industrySlots.map(s => ({

                })),
                market: null,
                merchants: city.merchants.map(m => ({

                })),
                merchantBonus: null,
            })),
            links: Array.from(this.game.links.values()).map(link => ({
                uid: link.uid,
                head: link.head,
                tail: link.tail,
                owner: link.owner?.uid || null,
            })),
        };
    }
}