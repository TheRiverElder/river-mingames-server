import { double, int } from "../CommonTypes";

export default interface Random {

    nextInt(minimum: int, maximum: int): int;

    nextFloat(minimum: double, maximum: double): double;

    nextBoolean(): boolean;

    // 返回[0, 1)中的数
    next(): double;
}