import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class StorageService {
    public get(key: string): string {
        return localStorage.getItem(key);
    }

    public set(key: string, value: string): void {
        return localStorage.setItem(key, value);
    }

    public remove(key: string): void {
        return localStorage.removeItem(key);
    }
}
