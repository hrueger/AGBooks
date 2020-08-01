import { Injectable } from "@angular/core";
import { ApplicationSettings } from "@nativescript/core";

@Injectable({ providedIn: "root" })
export class StorageService {
    public get(key: string): string {
        return ApplicationSettings.getString(key);
    }

    public set(key: string, value: string): void {
        return ApplicationSettings.setString(key, value);
    }

    public remove(key: string): void {
        return ApplicationSettings.remove(key);
    }
}
