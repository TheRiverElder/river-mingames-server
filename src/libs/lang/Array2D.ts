import { int } from "../CommonTypes";
import { createArray } from "./Collections";



export default class Array2D<T = any> {

    public readonly width: int;
    public readonly height: int;

    private readonly rows: Array<Array<T>>;

    constructor(width: int, height: int, generateElement: (x: int, y: int) => T) {
        this.width = width;
        this.height = height;
        this.rows = Array(height);
        for (let y = 0; y < height; y++) {
            this.rows[y] = createArray(width, x => generateElement(x, y));
        }
    }

    public contains(x: int, y: int): boolean {
        return (x >= 0 && x < this.width) && (y >= 0 && y < this.height);
    }

    public getRows(): Array<Array<T>> {
        return this.rows.map(row => row.slice());
    }

    public getColumns(): Array<Array<T>> {
        return createArray(this.width, x => this.getColumn(x));
    }

    public getRow(y: int): Array<T> {
        return this.rows[y]?.slice() || [];
    }

    public getColumn(x: int): Array<T> {
        return this.rows.map(row => row[x]);
    }

    public getOrNull(x: int, y: int): T | null {
        const row = this.rows[y];
        if (!row) return null;
        return row[x] || null;
    }

    public get(x: int, y: int): T {
        return this.rows[y][x];
    }

    public set(x: int, y: int, value: T) {
        const row = this.rows[y];
        if (!row) return null;
        row[x] = value;
    }

    public forEach(callback: (value: T, x: int, y: int) => void) {
        for (let y = 0; y < this.height; y++) {
            const row = this.rows[y];
            for (let x = 0; x < this.width; x++) {
                callback(row[x], x, y);
            }
        }
    }

    public map<R>(callback: (value: T, x: int, y: int) => R): Array2D<R> {
        return new Array2D(this.width, this.height, (x, y) => callback(this.get(x, y), x, y));
    }

    public getAll(): Array<T | null> {
        return this.rows.flat(1);
    }
}