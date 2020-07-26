import { NextFunction, Request, Response } from "express";
import * as i18n from "i18n";
import { getRepository } from "typeorm";

import { Admin } from "../entity/Admin";

export const checkForAdmin = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const id = res.locals.jwtPayload.userId;

    const userRepository = getRepository(Admin);
    let user: Admin;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send({message: "errors.userNotFound", logout: true});
    }

    if (user) {
      next();
    } else {
      res.status(401).send({message: "errors.notAllowed"});
    }
  };
};
