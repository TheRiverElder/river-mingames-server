import { int, double } from "../CommonTypes";
import Random from "./Random";

export default abstract class RandomAdapter implements Random {
    
    nextInt(minimum: int, maximum: int): int {
        return Math.floor(minimum + (this.next() * (maximum - minimum)));
    }

    nextFloat(minimum: double, maximum: double): double {
        return minimum + (this.next() * (maximum - minimum));
    }

    nextBoolean(): boolean {
        return this.next() < 0.5;
    }

    // 其它方法都依赖这个方法
    abstract next(): double;
    
}