import { Request, Response } from "express";
import { getRepository } from "typeorm";
import * as path from "path";
import { Book } from "../entity/Book";
import { User } from "../entity/User";

class BookController {
    public static listAll = async (req: Request, res: Response): Promise<void> => {
        const bookRepository = getRepository(Book);
        const me = await getRepository(User).findOne(res.locals.jwtPayload.userId);
        // const books = await bookRepository.find();

        let where = "";
        let checkLang = true;
        let checkBranch = true;
        if (me.grade.startsWith("5")) {
            where += "`5` = 1";
            checkLang = false;
            checkBranch = false;
        } else if (me.grade.startsWith("6")) {
            where += "`6` = 1";
            checkBranch = false;
        } else if (me.grade.startsWith("7")) {
            where += "`7` = 1";
            checkBranch = false;
        } else if (me.grade.startsWith("8")) {
            where += "`8` = 1";
        } else if (me.grade.startsWith("9")) {
            where += "`9` = 1";
        } else if (me.grade.startsWith("10")) {
            where += "(`10` = 1";
            if (me.uebergang) {
                where += " OR `10`= 0 ) AND `uebergang` = '1'";
                checkBranch = false;
                checkLang = false;
            } else {
                where += ")";
            }
        } else if (me.grade == "Q11") {
            where += "`Q11` = 1";
            checkLang = false;
            checkBranch = false;
        } else if (me.grade == "Q12") {
            where += "`Q12` = 1";
            checkLang = false;
            checkBranch = false;
        } else if (me.grade == "Q13") {
            where += "`Q13` = 1";
            checkLang = false;
            checkBranch = false;
        } else {
            res.status(400).send(`Fehlerhafte Klasse:${me.grade}`);
            return;
        }

        if (checkLang == true) {
            if (me.language == "französisch" || me.language == "latein") {
                where += ` AND (\`language\` = '${me.language == "französisch" ? "f" : "l"}' OR \`language\`='' OR \`language\` IS NULL)`;
            }
        }
        if (checkBranch == true) {
            if (me.branch == "naturwissenschaftlich" || me.branch == "sprachlich") {
                where += " AND (`branch` = 'branch' OR `branch`='' OR `branch` IS NULL)";
            }
            where += " AND `branch`!='sf'";
        }
        const sql = `SELECT * FROM \`book\` WHERE ${where} ORDER BY \`subject\``;
        const books = await bookRepository.query(sql);

        /* const order = db->query("SELECT `order` FROM `orders` WHERE `user`='user'");
        if (order) {
            order = order->fetch_all(MYSQLI_ASSOC);
        } else {
            die(db->error);
        }

        if (isset(order[0]["order"])) {
            order = unserialize(order[0]["order"]);
        } else {
            order = array();
        } */
        for (const book of books) {
            book.number = me.classSize;
            /* for (const orderedBook of order) {
                if (book.id == orderedBook.id) {
                    book.number = orderedBook.number;
                }
            } */
        }

        res.send(books);
    }

    public static cover = async (req: Request, res: Response): Promise<void> => {
        const bookRepository = getRepository(Book);
        try {
            const book = await bookRepository.findOneOrFail(req.params.id);
            res.sendFile(path.join(__dirname, `../../assets/images/cover/${book.short}.jpg`));
        } catch {
            res.send();
        }
    }
    /*
      public static editBook = async (req: Request, res: Response): Promise<void> => {
          const bookRepository = getRepository(Book);
          const { name } = req.body;
          if (name == undefined) {
              res.status(400).send(i18n.__("errors.notAllFieldsProvided"));
              return;
          }
          try {
              const book = await bookRepository.findOne({ where: { guid: req.params.guid } });
              book.name = name;
              bookRepository.save(book);
          } catch (err) {
              res.status(500).send({ message: err });
              return;
          }
          res.send({ status: true });
      }

      public static newBooks = async (req: Request, res: Response): Promise<void> => {
          const bookRepository = getRepository(Book);
          let { books } = req.body;
          if (!(books && isArray(books) && books.length > 0)) {
              res.status(400).send({ message: i18n.__("errors.notAllFieldsProvided") });
              return;
          }
          books = books.map((t) => ({
              activated: false,
              guid: t.guid,
              name: t.name,
          }));

          try {
              await bookRepository.save(books);
          } catch (e) {
              res.status(500).send({ message: `${i18n.__("errors.error")} ${e.toString()}` });
              return;
          }

          res.status(200).send({ status: true });
      }

      public static deleteBook = async (req: Request, res: Response): Promise<void> => {
          const id = req.params.book;
          const bookRepository = getRepository(Book);
          try {
              await bookRepository.delete(id);
          } catch (error) {
              res.status(404).send({ message: i18n.__("errors.bookNotFound") });
              return;
          }
          res.status(200).send({ status: true });
      } */
}

export default BookController;