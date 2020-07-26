import { NextFunction, Request, Response } from "express";
import { getRepository } from "typeorm";

import { Admin } from "../entity/Admin";

export const checkForAdmin = () => async (
    req: Request, res: Response, next: NextFunction,
): Promise<void> => {
    const id = res.locals.jwtPayload.userId;

    const userRepository = getRepository(Admin);
    let user: Admin;
    try {
        user = await userRepository.findOneOrFail(id);
    } catch {
        res.status(401).send({ message: "errors.userNotFound", logout: true });
    }

    if (user) {
        next();
    } else {
        res.status(401).send({ message: "errors.notAllowed" });
    }
};
