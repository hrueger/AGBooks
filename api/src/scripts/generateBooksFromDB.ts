import { getConfig } from "../utils/config";
import { createConnection, getRepository } from "typeorm";
import { User } from "../entity/User";
import { Book } from "../entity/Book";
import { Admin } from "../entity/Admin";
import * as fs from "fs";
import * as path from "path";

const config: any = getConfig();

(async () => {
    await createConnection({
        charset: "utf8mb4",
        database: config.DB_NAME,
        entities: [
            User,
            Book,
            Admin,
        ],
        host: config.DB_HOST,
        password: config.DB_PASSWORD,
        port: config.DB_PORT,
        type: "mysql",
        username: config.DB_USER,
    });
    const books = await getRepository(Book).find();
    fs.writeFileSync(path.join(__dirname, "../resources/books.json"), JSON.stringify(books, ["id","name", "publisher","subject","short","language","branch","uebergang", "5", "6", "7", "8", "9", "10", "Q11", "Q12", "Q13"], 4));
    process.exit(0);
})()