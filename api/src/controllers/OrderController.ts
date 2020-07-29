import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { Book } from "../entity/Book";
import { Order } from "../entity/Order";

class OrderController {
    public static order = async (req: Request, res: Response): Promise<void> => {
        const { books } = req.body;
        if (!books || !Array.isArray(books)) {
            res.status(400).send({ message: "Nicht alle Felder ausgefüllt!" });
            return;
        }
        const userRepository = getRepository(User);
        const me = await userRepository.findOne(res.locals.jwtPayload.userId);
        const order = {};
        for (const b of books as {id: number, number: number}[]) {
            order[b.id] = b.number;
        }
        me.order = order;
        await userRepository.save(me);
        res.send({ success: true });
    }

    public static submit = async (req: Request, res: Response): Promise<void> => {
        const userRepository = getRepository(User);
        const me = await userRepository.findOne(res.locals.jwtPayload.userId);
        me.orderSubmitted = true;
        me.orderTimestamp = new Date();
        await userRepository.save(me);
        res.send({ success: true });
    }

    public static orderDone = async (req: Request, res: Response): Promise<void> => {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne(req.params.id);
        user.orderDone = true;
        await userRepository.save(user);
        res.send({ success: true });
    }

    public static listAll = async (req: Request, res: Response): Promise<void> => {
        const userRepository = getRepository(User);
        const users = await userRepository.find({
            where: {
                orderSubmitted: true,
            },
        });
        const books = await getRepository(Book).find();
        const orders: Order[] = [];
        for (const user of users) {
            const o = new Order();
            o.user = user;
            o.books = [];
            for (const [bookId, number] of Object.entries(user.order)) {
                const book = books.find((b) => b.id == parseInt(bookId, 10));
                book.number = number;
                o.books.push(book);
            }
            orders.push(o);
        }
        res.send(orders);
    }

    public static forCheck = async (req: Request, res: Response): Promise<void> => {
        const userRepository = getRepository(User);
        const bookRepository = getRepository(Book);
        const allBooks = await bookRepository.find();
        const me = await userRepository.findOne(res.locals.jwtPayload.userId);
        const religionAlert = Object.keys(me.order)
            .filter((bid) => OrderController.isReligionBook(allBooks, parseInt(bid, 10)))
            .reduce((p, c) => p + me.order[c], 0) != me.classSize;
        const order: Book[] = [];
        for (const bookId of Object.keys(me.order)) {
            const book = new Book();
            const bid = parseInt(bookId, 10);
            if (OrderController.isReligionBook(allBooks, bid)) {
                if (religionAlert) {
                    book.alert = "Die Gesamtanzahl der Religionsbücher entspricht nicht der Klassenstärke!";
                }
            } else if (me.order[bid] != me.classSize && !me.grade.startsWith("Q")) {
                book.alert = "Die Buchanzahl entspricht nicht der Klassenstärke!";
            }
            Object.assign(book, allBooks.find((b) => b.id == bid));
            book.number = me.order[bid];
            order.push(book);
        }
        res.send(order);
    }

    private static isReligionBook(allBooks: Book[], bid: number): boolean {
        const religionSubjects = ["Religion ev", "Religion rk", "Ethik"];
        return religionSubjects.includes(
            allBooks.find((b) => b.id == bid).subject,
        );
    }
}

export default OrderController;
