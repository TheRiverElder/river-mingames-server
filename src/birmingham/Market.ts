

export default class Market {
    readonly capacityLevel: number;
    amount: number;

    constructor(capacityLevel: number, amount: number) {
        this.capacityLevel = capacityLevel;
        this.amount = amount;
    }

    save(): any {
        return {
            capacityLevel: this.capacityLevel,
            amount: this.amount,
        };
    }
    
    static load(data: any): Market {
        return new Market(data.capacityLevel, data.amount);
    }

    getUpdateData() {
        return {
            amount: this.amount,
        };
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