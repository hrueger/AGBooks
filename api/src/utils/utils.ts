export function toInt(v: string | number): number {
    if (typeof v == "string") {
        return parseInt(v, undefined);
    }
    return v;
}
