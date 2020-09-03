module.exports = {
    packages: {
        "@nativescript/angular": {
            entryPoints: {
                ".": {
                    override: {
                        main: "./index.js",
                        typings: "./index.d.ts",
                    },
                    ignoreMissingDependencies: true,
                },
            },
            ignorableDeepImportMatchers: [
                /zone.js\//,
                /tns-core-modules\//,
                /@nativescript\/core\//,
                /nativescript-angular\//,
            ],
        },
        "nativescript-localize": {
            entryPoints: {
                ".": {
                    override: {
                        main: "./angular.js",
                        typings: "./angular.d.ts",
                    },
                    ignoreMissingDependencies: true,
                },
            },
            ignorableDeepImportMatchers: [
                /@nativescript\/core\//,
            ],
        },
    },
};