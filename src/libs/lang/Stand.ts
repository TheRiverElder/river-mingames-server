export default interface Stand<T> {
    get(): T;
    set(value: T): void;
}