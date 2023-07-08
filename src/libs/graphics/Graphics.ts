import { int } from "../CommonTypes";

export function drawChamferRect(g: CanvasRenderingContext2D, edgeLength: number, chamferLength: number) {
    g.beginPath();
    g.moveTo(0, chamferLength);
    g.lineTo(0, edgeLength - chamferLength);
    g.lineTo(chamferLength, edgeLength);
    g.lineTo(edgeLength - chamferLength, edgeLength);
    g.lineTo(edgeLength, edgeLength - chamferLength);
    g.lineTo(edgeLength, chamferLength);
    g.lineTo(edgeLength - chamferLength, 0);
    g.lineTo(chamferLength, 0);
    g.closePath();
}

export function int2Color(color: int): string {
    const value = Math.floor(color);
    return '#' + [
        (value >>> 16) & 0xff,
        (value >>> 8) & 0xff,
        value & 0xff,
    ].map(v => v.toString(16).padStart(2, '0')).join('');
}