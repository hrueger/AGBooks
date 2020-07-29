import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";

import { Admin } from "../entity/Admin";

export const checkForAdmin = async (req: Request,
    res: Response, next: NextFunction): Promise<void> => {
    const id = res.locals.jwtPayload.userId;

    if (!res.locals.jwtPayload.isAdmin) {
        res.status(401).send({ message: "Diese Aktion ist Ihnen nicht erlaubt!" });
    }

    const userRepository = getRepository(Admin);
    let user: Admin;
    try {
        user = await userRepository.findOneOrFail(id);
    } catch {
        res.status(401).send({ message: "Der Benutzer wurde nicht gefunden!", logout: true });
    }

    if (user) {
        next();
    } else {
        res.status(401).send({ message: "Diese Aktion ist Ihnen nicht erlaubt!" });
    }
};
