export type int = number;
export type double = number;

export interface Unique {
    get uid(): int;
}

export type Supplier<R> = () => R;
export type Consumer<T> = (input: T) => void;
export type Productor<T, R> = (input: T) => R;
export type BiProductor<T1, T2, R> = (input1: T1, input2: T2) => R;
export type Predicator<T> = (input: T) => boolean;

export type Pair<T1, T2 = T1> = [T1, T2];
export type Coordinate = [number, number];