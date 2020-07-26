import { getRepository, MigrationInterface } from "typeorm";
import * as fs from "fs";
import * as path from "path";
import { Book } from "../entity/Book";

export class createBooks1536535135468 implements MigrationInterface {
    public async up(): Promise<any> {
        const bookRepository = getRepository(Book);
        const books: Book[] = [];
        for (const data of JSON.parse(fs.readFileSync(path.join(__dirname, "../resources/books.json")).toString()) as Book[]) {
            const book = new Book();
            Object.assign(book, data);
            books.push(book);
        }
        await bookRepository.save(books);
    }

    public async down(): Promise<any> {
        //
    }
}
