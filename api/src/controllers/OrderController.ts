import { Request, Response } from "express";
import { getRepository, LessThan } from "typeorm";
import * as SSE from "express-sse";
import { User } from "../entity/User";
import { Book } from "../entity/Book";
import { Order } from "../entity/Order";
import * as fs from "fs";

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
        OrderController.sendChangesToBackend(res);
        res.send({ success: true });
    }

    public static orderDone = async (req: Request, res: Response): Promise<void> => {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne(req.params.id);
        user.orderDone = true;
        await userRepository.save(user);
        for (const [userId, sse] of Object.entries(res.app.locals.live) as [string, SSE][]) {
            sse.send(await OrderController.getOrderStatus(userId));
        }
        OrderController.sendChangesToBackend(res);
        res.send({ success: true });
    }

    public static orderAccepted = async (req: Request, res: Response): Promise<void> => {
        await OrderController.acceptOrder(req.params.id);
        OrderController.sendChangesToBackend(res);
        res.send({ success: true });
    }

    public static accept = async (req: Request, res: Response): Promise<void> => {
        await OrderController.acceptOrder(res.locals.jwtPayload.userId);
        OrderController.sendChangesToBackend(res);
        res.send({ success: true });
    }

    public static deleteOrder = async (req: Request, res: Response): Promise<void> => {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne(req.params.id);
        user.order = {};
        user.orderSubmitted = false;
        user.orderDone = false;
        user.orderAccepted = false;
        user.orderTimestamp = undefined;
        await userRepository.save(user);
        OrderController.sendChangesToBackend(res);
        res.send({ success: true });
    }

    public static statistics = async (req: Request, res: Response): Promise<void> => {
        const userRepository = getRepository(User);
        const bookRepository = getRepository(Book);
        const users = await userRepository.find({
            where: {
                orderDone: true,
                orderAccepted: true,
                orderSubmitted: true,
            },
        });

        const books = await bookRepository.find();
        const orders = [];
        for (const user of users) {
            const completeOrder = [];
            for (const [bookId, number] of Object.entries(user.order)) {
                const bid = parseInt(bookId);
                completeOrder.push({
                    name: books.find((b) => b.id == bid).name,
                    subject: books.find((b) => b.id == bid).subject,
                    number,
                });
            }
            const order = {} as any;
            order.order = completeOrder;
            order.user = user;
            orders.push(order);
        }
        res.send({ orders });
    }

    public static live = async (req: Request, res: Response): Promise<void> => {
        const sse = new SSE([await OrderController.getOrderStatus(res.locals.jwtPayload.userId)]);
        res.app.locals.live[res.locals.jwtPayload.userId] = sse;
        sse.init(req, res);
    }

    private static async acceptOrder(id: string) {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne(id);
        user.orderAccepted = true;
        await userRepository.save(user);
    }

    private static async getOrderStatus(userId: string): Promise<any> {
        return {
            ordersLeft: await OrderController
                .getQueueCountBeforeOrder(parseInt(userId, 10)),
            orderReady: (await getRepository(User).findOne(parseInt(userId, 10))).orderDone,
        };
    }

    private static async getQueueCountBeforeOrder(userId: number) {
        const userRepository = getRepository(User);
        const myOrder = await userRepository.findOne(userId);
        return userRepository.count({
            where: {
                orderDone: false,
                orderTimestamp: LessThan(myOrder.orderTimestamp),
            },
        });
    }

    public static listAll = async (req: Request, res: Response): Promise<void> => {
        const orders: Order[] = await OrderController.getAllOrders();
        res.send(orders);
    }

    public static listAllLive = async (req: Request, res: Response): Promise<void> => {
        const sse = new SSE();
        res.app.locals.backendLive.push(sse);
        sse.init(req, res);
    }

    private static async getAllOrders() {
        const userRepository = getRepository(User);
        const users = await userRepository.find({
            where: {
                orderSubmitted: true,
            },
            order: {
                orderTimestamp: "ASC",
            },
        });
        const books = await getRepository(Book).find();
        const orders: Order[] = [];
        for (const user of users) {
            const o = new Order();
            o.user = user;
            o.books = [];
            for (const [bookId, number] of Object.entries(user.order)) {
                // don't remove the { ... }, otherwise books with same ID will have the same number
                const book = { ...books.find((b) => b.id == parseInt(bookId, 10)) };
                book.number = number;
                o.books.push(book);
            }
            orders.push(o);
        }
        return orders;
    }

    private static async sendChangesToBackend(res: Response) {
        const data = await OrderController.getAllOrders();
        for (const sse of res.app.locals.backendLive) {
            sse.send(data);
        }
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
