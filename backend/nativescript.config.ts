import { NativeScriptConfig } from "@nativescript/core";

export default {
    id: "de.hannesrueger.agbooks",
    appResourcesPath: "App_Resources",
    android: {
        v8Flags: "--expose_gc",
        markingMode: "none",
    },
    appPath: "src",
    nsext: ".tns",
    webext: "",
    shared: true,
} as NativeScriptConfig;
