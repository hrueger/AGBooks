import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";

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
        console.log(me);
        await userRepository.save(me);
        res.send({ success: true });
    }
}

export default OrderController;
