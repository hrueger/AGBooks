import { ApplicationSettings } from "@nativescript/core";

export function getApiUrl(): string {
    return ApplicationSettings.getString("apiUrl", "");
}
