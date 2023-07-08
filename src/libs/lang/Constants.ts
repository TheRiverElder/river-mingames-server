export const NOP = () => {};

export function stringHashCode(value: string) {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
        hash = 31 * hash + value.charCodeAt(i);
    }
    return hash;
}