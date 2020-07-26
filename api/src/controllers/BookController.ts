import { Request, Response } from "express";
import * as i18n from "i18n";
import { getRepository } from "typeorm";
import { isArray } from "util";
import { Book } from "../entity/Book";

class BookController {
  public static listAll = async (req: Request, res: Response): Promise<void> => {
      const bookRepository = getRepository(Book);
      const books = await bookRepository.find();
      res.send(books);
  }

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
  }
}

export default BookController;
