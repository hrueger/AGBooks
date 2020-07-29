import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as express from "express";
import * as helmet from "helmet";
import * as path from "path";
import "reflect-metadata";
import { createConnection } from "typeorm";
import * as fs from "fs";
import { Book } from "./entity/Book";
import { Admin } from "./entity/Admin";
import { User } from "./entity/User";
import { createAdminUser1574018391679 } from "./migration/1574018391679-createAdminUser";
import routes from "./routes";
import { createBooks1536535135468 } from "./migration/1536535135468-createBooks";
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
    migrations: [createAdminUser1574018391679, createBooks1536535135468],
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
        app.use(helmet());
        // This transforms the incoming JSON body into objects
        app.use(bodyParser.json());

        // Set all routes from routes folder
        app.use("/api", routes);

        // Set routes for static built frontend
        app.use("/", express.static(path.join(__dirname, "../../frontend_build")));

        // That starts the server on the given port
        app.listen(config.PORT, () => {
            // eslint-disable-next-line no-console
            console.log(`Server started on port ${config.PORT}!`);
        });
    })
    // If an error happens, print it on the console
    // eslint-disable-next-line no-console
    .catch((error) => console.log(error));
