import { CSSProperties } from "react";
import { int } from "../CommonTypes";
import { square } from "./Mathmatics";

export default class Vector2 {

    public static readonly INVALID_VECTOR2: Vector2 = new Vector2(Number.NaN, Number.NaN);

    public static fromPolar(angle: number, modulo: number) {
        return new Vector2(
            modulo * Math.cos(angle),
            modulo * Math.sin(angle),
        );
    }
    
    public static fromRectangular(x: number, y: number) {
        return new Vector2(x, y);
    }
    
    public static zero() {
        return new Vector2(0, 0);
    }
    
    public static readonly ZERO = new Vector2(0, 0);

    public readonly x: number;
    public readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public add(vector: Vector2): Vector2 {
        return new Vector2(this.x + vector.x, this.y + vector.y);
    }

    public sub(vector: Vector2): Vector2 {
        return new Vector2(this.x - vector.x, this.y - vector.y);
    }

    public mul(factor: number | Vector2): Vector2 {
        if (factor instanceof Vector2) return new Vector2(this.x * factor.x, this.y * factor.y);
        else return new Vector2(this.x * factor, this.y * factor);
    }

    public div(factor: number): Vector2 {
        return new Vector2(this.x / factor, this.y / factor);
    }

    public get angle(): number {
        return Math.atan2(this.y, this.x);
    }

    public get moduloSquared(): number {
        return square(this.x) + square(this.y);
    }

    public get modulo(): number {
        return Math.sqrt(this.moduloSquared);
    }

    public get normalized(): Vector2 {
        if (this.moduloSquared === 0) return this;
        return this.mul(1.0 / this.modulo);
    }

    public get aspectRatio(): number {
        return this.y / this.x;
    }

    public manhattanDistanceTo(vector: Vector2): number {
        return Math.abs(vector.x - this.x) + Math.abs(vector.y - this.y);
    }

    public distanceTo(vector: Vector2): number {
        return Math.sqrt(this.distanceSquaredTo(vector));
    }

    public distanceSquaredTo(vector: Vector2): number {
        return square(vector.x - this.x) + square(vector.y - this.y);
    }


    public toArray(): [number, number] {
        return [this.x, this.y];
    }

    public isValid() {
        return !this.isInvalid();
    }

    public isInvalid() {
        return this === Vector2.INVALID_VECTOR2 || (Number.isNaN(this.x) || Number.isNaN(this.y));
    }

    toPositionCss(): CSSProperties {
        return {
            left: this.x + "px",
            top: this.y + "px",
        };
    }

    toSizeCss(): CSSProperties {
        return {
            width: this.x + "px",
            height: this.y + "px",
        };
    }

    toHunmanReadableString(presicion: int = 2): string {
        return `(${this.x.toFixed(presicion)}, ${this.y.toFixed(presicion)})`;
    }

    toString(presicion: int = 2) {
        return `(${this.x.toFixed(presicion)}, ${this.y.toFixed(presicion)})`;
    }
}