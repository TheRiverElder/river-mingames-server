import { double, int } from "../CommonTypes";
import RandomAdapter from "./RandomAdapter";

export default class PseudoRandom extends RandomAdapter {

    private seed: int;

    constructor(seed: int = Date.now()) {
        super();
        this.seed = Math.floor(seed) % Number.MAX_SAFE_INTEGER;
        this.next();
    }

    override next(): double {
        this.seed = Math.floor(this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280.0;
    }

}