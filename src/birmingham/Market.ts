import Game from "./Game";

export default class Market {
    readonly uid: number;
    readonly game: Game;
    readonly string: string;
    readonly capacityLevel: number;
    amount: number;

    constructor(game: Game, uid: number, string: string, capacityLevel: number, amount: number) {
        this.game = game;
        this.uid = uid;
        this.string = string;
        this.capacityLevel = capacityLevel;
        this.amount = amount;
    }

    getCapacity() {
        return (this.capacityLevel - 1) * 2;
    }

    getNextPrice() {
        return this.capacityLevel - Math.ceil(this.amount / 2);
    }

    getNextPayback() {
        return this.capacityLevel - Math.ceil((this.amount + 1) / 2);
    }

    // 返回所需的金钱
    take(amount: number): number {
        let price = 0;
        for (let i = 0; i < amount; i++) {
            if (this.amount > 0) {
                price += this.getNextPrice();
                this.amount--;
            } else {
                price += this.capacityLevel;
            }
        }
        return price;
    }

    // 返回[没卖出的资源数量, 所得的金钱]
    put(amount: number): [number, number] {
        let payback = 0;
        let rest = amount;
        for (let i = 0; i < amount && this.amount < this.getCapacity(); i++) {
            payback += this.getNextPayback();
            this.amount++;
            rest--;
        }
        return [rest, payback];
    }

}