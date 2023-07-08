import NumberGenerator from "./NumberGenerator";

export default class IncrementNumberGenerator implements NumberGenerator {
    private counter: number;
    private step: number;

    constructor(initialValue: number = 0, step: number = +1) {
        this.counter = initialValue;
        this.step = step;
    }

    generate(): number {
        return (this.counter += this.step);
    }
}