import * as path from "path";

export const envOptions = {
    DB_NAME: "agbooks",
    DB_USER: "root",
    DB_PASSWORD: "",
    DB_HOST: "localhost",
    DB_PORT: 3306,
    PORT: 3000,
    JWT_SECRET: "asdasdas",
};

export const globals = {
    configPath: path.resolve("/app/config/agbooks-config.json"),
};
