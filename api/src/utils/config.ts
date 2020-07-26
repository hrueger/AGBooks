import * as fs from "fs";
import { globals } from "../globals";

export function getConfig(): any {
    try {
        return JSON.parse(fs.readFileSync(globals.configPath).toString());
    } catch {
        return {};
    }
}

export function setConfig(config: Record<string, unknown>): boolean {
    try {
        fs.writeFileSync(globals.configPath, JSON.stringify(config));
        return true;
    } catch {
        return false;
    }
}
