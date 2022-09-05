/* eslint-disable max-len */
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import * as path from "path";
import * as fs from "fs";
import archiver from "archiver";
import yauzl from "yauzl";
import { Book } from "../entity/Book";
import { User } from "../entity/User";

class BookController {
    public static listAll = async (req: Request, res: Response): Promise<void> => {
        const me = await getRepository(User).findOne(res.locals.jwtPayload.userId);
        const books = await BookController.findBooks(me);
        if (books === false) {
            res.status(400).send(`Fehlerhafte Klasse:${me.grade}`);
            return;
        }
        res.send(books);
    }

    public static listAllAdmin = async (req: Request, res: Response): Promise<void> => {
        const books = await getRepository(Book).find();
        res.send(books);
    }

    public static exportBackup = async (req: Request, res: Response): Promise<void> => {
        const books = await getRepository(Book).find();
        res.setHeader("Content-disposition", `attachment; filename=AGBooks_Export_${new Date().toISOString().replace(/[^\d]/g, "-")}.zip`);
        res.setHeader("Content-type", "application/zip");

        const archive = archiver("zip", {
            zlib: { level: 9 },
        });

        archive.on("warning", (err) => {
            throw err;
        });
        archive.on("error", (err) => {
            throw err;
        });

        archive.pipe(res);
        archive.append(JSON.stringify(books), { name: "books.json" });
        archive.directory(BookController.getCoverFolderPath(), "cover");
        archive.finalize();
    }

    public static importBackup = async (req: Request, res: Response): Promise<void> => {
        const buffer = Buffer.from(req.body.backupBase64.slice(req.body.backupBase64.indexOf(",") + 1), "base64url");

        yauzl.fromBuffer(buffer, { lazyEntries: true }, (err, zipfile) => {
            if (err) throw err;
            zipfile.readEntry();
            zipfile.on("entry", (entry) => {
                console.log("-->", entry);
                if (/\/$/.test(entry.fileName)) {
                    zipfile.readEntry();
                } else {
                    zipfile.openReadStream(entry, (e, readStream) => {
                        if (e) throw e;
                        if (entry.fileName === "books.json") {
                            let data = "";
                            readStream.on("data", (chunk) => {
                                data += chunk;
                            });
                            readStream.on("end", async () => {
                                const books = JSON.parse(data);
                                await getRepository(Book).save(books);
                                zipfile.readEntry();
                            });
                        } else {
                            const filePath = path.join(BookController.getCoverFolderPath(), entry.fileName.split("/")[1]);
                            const writeStream = fs.createWriteStream(filePath);
                            readStream.pipe(writeStream);
                            readStream.on("end", () => {
                                zipfile.readEntry();
                            });
                        }
                    });
                }
            });
            zipfile.on("end", () => {
                res.send({ success: true });
            });
        });
    }

    public static editBook = async (req: Request, res: Response): Promise<void> => {
        try {
            let book = await getRepository(Book).findOneOrFail(req.params.id);
            book = {
                ...book,
                ...req.body,
            };
            await getRepository(Book).save(book);
            res.send({ success: true });
        } catch {
            res.status(400).send({ error: "Unknown Error" });
        }
    }

    public static deleteBook = async (req: Request, res: Response): Promise<void> => {
        try {
            await getRepository(Book).delete(req.params.id);
            res.send({ success: true });
        } catch {
            res.status(400).send({ error: "Unknown Error" });
        }
    }

    public static createBook = async (req: Request, res: Response): Promise<void> => {
        const book: Partial<Book> = {
            5: false,
            6: false,
            7: false,
            8: false,
            9: false,
            10: false,
            Q11: false,
            Q12: false,
            Q13: false,
            branch: "",
            language: "",
            name: "Unbenanntes Buch",
            subject: "",
            publisher: "Unbekannter Verlag",
            comment: "",
            short: "",
            uebergang: false,
        };
        await getRepository(Book).save(book);
        BookController.listAllAdmin(req, res);
    }

    public static availableBooks = async (req: Request, res: Response): Promise<void> => {
        const me = new User();
        me.grade = req.body.grade;
        me.language = req.body.language;
        me.branch = req.body.branch;
        me.uebergang = req.body.uebergang;
        const books = await BookController.findBooks(me);
        if (books === false) {
            res.status(400).send(`Fehlerhafte Klasse:${me.grade}`);
            return;
        }
        res.send(books);
    }

    private static getCoverFolderPath(): string {
        return `${BookController.getAssetsFolderPath()}/images/cover`;
    }

    private static getAssetsFolderPath(shipped = false): string {
        return __dirname.endsWith("controllers") ? path.join(__dirname, "../../assets") : shipped ? "/app/dist/assets/" : "/app/data";
    }

    public static async findBooks(user: User): Promise<Book[] | false> {
        const bookRepository = getRepository(Book);
        let where = "";
        let checkLang = true;
        let checkBranch = true;
        if (user.grade.startsWith("5")) {
            where += "`5` = 1";
            checkLang = false;
            checkBranch = false;
        } else if (user.grade.startsWith("6")) {
            where += "`6` = 1";
            checkBranch = false;
        } else if (user.grade.startsWith("7")) {
            where += "`7` = 1";
            checkBranch = false;
        } else if (user.grade.startsWith("8")) {
            where += "`8` = 1";
        } else if (user.grade.startsWith("9")) {
            where += "`9` = 1";
        } else if (user.grade.startsWith("10")) {
            where += "(`10` = 1";
            if (user.uebergang) {
                where += " OR `10`= 0 ) AND `uebergang` = '1'";
                checkBranch = false;
                checkLang = false;
            } else {
                where += ")";
            }
        } else if (user.grade == "Q11") {
            where += "`Q11` = 1";
            checkLang = false;
            checkBranch = false;
        } else if (user.grade == "Q12") {
            where += "`Q12` = 1";
            checkLang = false;
            checkBranch = false;
        } else if (user.grade == "Q13") {
            where += "`Q13` = 1";
            checkLang = false;
            checkBranch = false;
        } else {
            return false;
        }

        if (checkLang == true) {
            if (user.language == "französisch" || user.language == "latein") {
                where += ` AND (\`language\` = '${user.language == "französisch" ? "f" : "l"}' OR \`language\`='' OR \`language\` IS NULL)`;
            }
        }
        if (checkBranch == true) {
            if (user.branch == "naturwissenschaftlich" || user.branch == "sprachlich") {
                where += ` AND (\`branch\` = '${user.branch == "naturwissenschaftlich" ? "n" : "s"}' OR \`branch\`='' OR \`branch\` IS NULL)`;
            }
            where += " AND `branch`!='sf'";
        }
        const sql = `SELECT * FROM \`book\` WHERE ${where} ORDER BY \`subject\``;
        const books = await bookRepository.query(sql);

        for (const book of books) {
            book.number = user.order && user.order[book.id] ? user.order[book.id] : user.classSize;
        }
        return books;
    }

    public static cover = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        if (typeof id !== "string") {
            res.status(400).send({ message: "Invalid ID!" });
            return;
        }
        const defaultCoverPath = path.join(`${BookController.getAssetsFolderPath(true)}/images/no_cover_available.png`);
        try {
            const coverPath = path.join(`${BookController.getCoverFolderPath()}/${id}.jpg`);
            if (!fs.existsSync(coverPath)) {
                res.sendFile(defaultCoverPath);
                return;
            }
            res.sendFile(coverPath);
        } catch (e) {
            console.log(e);
            res.sendFile(defaultCoverPath);
        }
    }

    public static uploadCover = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        if (typeof id !== "string") {
            res.status(400).send({ message: "Invalid ID!" });
            return;
        }
        try {
            const coverPath = path.join(`${BookController.getCoverFolderPath()}/${id}.jpg`);
            let data = req.body.cover;
            if (!data) {
                res.status(400).send({ error: "No image data!" });
                return;
            }
            data = data.replace(/^data:image\/jpeg;base64,/, "");
            data = Buffer.from(data, "base64");
            fs.writeFileSync(coverPath, data);
        } catch {
            //
        }
        res.send({ success: true });
    }

    public static deleteCover = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        if (typeof id !== "string") {
            res.status(400).send({ message: "Invalid ID!" });
            return;
        }
        try {
            const coverPath = path.join(__dirname, `../../assets/images/cover/${id}.jpg`);
            if (fs.existsSync(coverPath)) {
                fs.unlinkSync(coverPath);
            }
        } catch {
            //
        }
        res.send({ success: true });
    }
}

export default BookController;
