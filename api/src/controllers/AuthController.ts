import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import * as SSE from "express-sse";
import { User } from "../entity/User";
import { Admin } from "../entity/Admin";

class AuthController {
    public static register = async (req: Request, res: Response): Promise<void> => {
        // Get user from database
        const userRepository = getRepository(User);
        let user = new User();
        user = await userRepository.save(user);

        const token = jwt.sign(
            { userId: user.id },
            req.app.locals.config.JWT_SECRET,
            { expiresIn: "8h" },
        );

        const response = {
            ...user,
            token,
        };

        // Send the jwt in the response
        res.send(response);
    }

    public static getHandoverCode = async (req: Request, res: Response): Promise<void> => {
        const userRepository = getRepository(User);
        const user = await userRepository.findOne(res.locals.jwtPayload.userId);
        user.handoverCode = Math.floor(10000 + Math.random() * 90000).toString();
        await userRepository.save(user);
        res.send({ code: user.handoverCode });
    }

    public static handoverLive = async (req: Request, res: Response): Promise<void> => {
        const sse = new SSE();
        res.app.locals.handoverLive[res.locals.jwtPayload.userId] = sse;
        sse.init(req, res);
    }

    public static takeover = async (req: Request, res: Response): Promise<void> => {
        const { code } = req.body;
        if (!code) {
            res.status(400).send("Code nicht bekommen!");
            return;
        }
        const userRepository = getRepository(User);
        try {
            const user = await userRepository.find({
                where: {
                    handoverCode: code,
                },
                take: 1,
            });
            if (user && user[0]) {
                const token = jwt.sign(
                    { userId: user[0].id },
                    req.app.locals.config.JWT_SECRET,
                    { expiresIn: "8h" },
                );
                const response = {
                    ...(user[0]),
                    token,
                    success: true,
                } as any;
                if (!user[0].orderSubmitted) {
                    response.returnToStep = 2;
                } else if (user[0].orderSubmitted && !user[0].orderDone) {
                    response.returnToStep = 5;
                } else if (user[0].orderSubmitted && user[0].orderDone && !user[0].orderAccepted) {
                    response.returnToStep = 5;
                } else if (user[0].orderSubmitted && user[0].orderDone && user[0].orderAccepted) {
                    response.returnToStep = 6;
                }
                res.send(response);
                return;
            }
        } catch {
            //
        }
        res.send({ success: false });
    }

    public static setUserdata = async (req: Request, res: Response): Promise<void> => {
        const {
            teacher, teacherShort, grade, course, language, branch, uebergang, room, classSize,
        } = req.body;
        if (!(teacher && teacherShort && grade && room && classSize)) {
            res.status(400).end(JSON.stringify({ error: "Nicht alle Felder wurden ausgefüllt!" }));
        }
        // Get user from database
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOne(res.locals.jwtPayload.userId);
            user.teacher = teacher;
            user.teacherShort = teacherShort;
            user.grade = grade;
            user.course = course;
            user.language = language;
            user.branch = branch;
            user.uebergang = uebergang;
            user.room = room;
            user.classSize = classSize;
            await userRepository.save(user);
        } catch (e) {
            res.status(400).send({ message: e });
            return;
        }
        res.send({ success: true });
    }

    public static getUserdata = async (req: Request, res: Response): Promise<void> => {
        const userRepository = getRepository(User);
        let user: User;
        try {
            user = await userRepository.findOne(res.locals.jwtPayload.userId);
            res.send(user);
        } catch (e) {
            res.status(400).send({ message: e });
        }
    }

    public static adminLogin = async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body;
        if (!(email && password)) {
            res.status(400).end(JSON.stringify({ error: "Nicht alle Felder ausgefüllt!" }));
        }

        // Get user from database
        const userRepository = getRepository(Admin);
        let user: Admin;
        try {
            user = await userRepository.createQueryBuilder("user")
                .addSelect("user.password")
                .where("user.email = :email", { email })
                .getOne();
        } catch (error) {
            res.status(401).end(JSON.stringify({ message: "Falsche Email!" }));
        }

        if (!user) {
            res.status(401).end(JSON.stringify({ message: "Falsche Email!" }));
            return;
        }
        if (!user.checkIfUnencryptedPasswordIsValid(password)) {
            res.status(401).end(JSON.stringify({ message: "Falsches Passwort!" }));
            return;
        }
        const token = jwt.sign(
            { userId: user.id, email: user.email, isAdmin: true },
            req.app.locals.config.JWT_SECRET,
            { expiresIn: "8h" },
        );

        const response = {
            ...user,
            token,
        };
        response.password = undefined;

        // Send the jwt in the response
        res.send(response);
    }
}
export default AuthController;
