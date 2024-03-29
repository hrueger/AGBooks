import cors from "cors";
import "reflect-metadata";
import { createConnection } from "typeorm";
import * as fs from "fs";
import express from "express";
import helmet from "helmet";
import { Book } from "./entity/Book";
import { Admin } from "./entity/Admin";
import { User } from "./entity/User";
import { createAdminUser1574018391679 } from "./migration/1574018391679-createAdminUser";
import routes from "./routes";
import { globals, envOptions } from "./globals";
import { getConfig, setConfig } from "./utils/config";

// write env to config file
if (!fs.existsSync(globals.configPath)) {
    fs.writeFileSync(globals.configPath, JSON.stringify({}));
}
const config = getConfig();
for (const key of Object.keys(envOptions)) {
    if (config[key] == undefined) {
        if (config.key !== process.env[key]) {
            config[key] = process.env[key];
        } else {
            config[key] = envOptions[key];
        }
    }
}
setConfig(config);

// Connects to the Database -> then starts the express
createConnection({
    charset: "utf8mb4",
    cli: {
        entitiesDir: "src/entity",
        migrationsDir: "src/migration",
        subscribersDir: "src/subscriber",
    },
    database: config.DB_NAME,
    // List all your entities here
    entities: [
        User,
        Book,
        Admin,
    ],
    host: config.DB_HOST,
    logging: false,
    // List all your migrations here
    migrations: [createAdminUser1574018391679],
    migrationsRun: true,
    password: config.DB_PASSWORD,
    port: config.DB_PORT,
    synchronize: true,
    type: "mysql",
    username: config.DB_USER,
})
    .then(async (connection) => {
    // Fix problems with UTF8 chars
        await connection.query("SET NAMES utf8mb4;");
        // In case entities have changed, sync the database
        await connection.synchronize();
        // Run migrations, see https://github.com/typeorm/typeorm/blob/master/docs/migrations.md
        // eslint-disable-next-line no-console
        console.log("Migrations: ", await connection.runMigrations());
        // Create a new express application instance
        const app = express();

        app.locals.config = config;

        app.locals.live = {};
        app.locals.handoverLive = {};
        app.locals.backendLive = [];

        // Call midlewares
        // This sets up secure rules for CORS, see https://developer.mozilla.org/de/docs/Web/HTTP/CORS
        app.use(cors());
        // This secures the app with some http headers
        app.use(helmet({
            contentSecurityPolicy: false,
        }) as any);
        // This transforms the incoming JSON body into objects
        app.use(express.json({ limit: "50mb" }));

        // Set all routes from routes folder
        app.use("/api", (req, res, next) => {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            (res as any).flush = () => {};
            next();
        }, routes);

        // Set routes for static built frontend
        app.use("/backend", express.static("/app/dist/backend"));
        app.use("/backend/*", express.static("/app/dist/backend/index.html"));

        // Set routes for static built frontend
        app.use("/", express.static("/app/dist/frontend"));
        app.use("*", express.static("/app/dist/frontend/index.html"));

        let port = 80;
        if (process.env.NODE_ENV == "development") {
            port = 3000;
        }
        // That starts the server
        app.listen(port, () => {
            // eslint-disable-next-line no-console
            console.log(`Server started on port ${port}!`);
        });
    })
    // If an error happens, print it on the console
    // eslint-disable-next-line no-console
    .catch((error) => console.log(error));
