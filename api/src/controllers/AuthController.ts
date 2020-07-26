import { validate } from "class-validator";
import { Request, Response } from "express";
import * as i18n from "i18n";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { config } from "../config/config";
import { Admin } from "../entity/Admin";
import { User } from "../entity/User";

class AuthController {

  public static register = async (req: Request, res: Response) => {

    // Get user from database
    const userRepository = getRepository(User);
    let user = new User();
    user = await userRepository.save(user);
    
    const token = jwt.sign(
      { userId: user.id },
      config.jwtSecret,
      { expiresIn: "8h" },
    );

    const response = {
      ...user,
      token,
    };

    // Send the jwt in the response
    res.send(response);
  }

  /*
public static adminLogin = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!(username && password)) {
      res.status(400).end(JSON.stringify({error: "errors.usernameOrPasswordEmpty"}));
    }

    // Get user from database
    const userRepository = getRepository(User);
    let user: User;
    try {
      user = await userRepository.createQueryBuilder("user")
        .addSelect("user.password")
        .where("user.username = :username", { username })
        .getOne();
    } catch (error) {
      res.status(401).end(JSON.stringify({message: "errors.wrongUsername"}));
    }

    if (!user) {
      res.status(401).end(JSON.stringify({message: "errors.wrongUsername"}));
      return;
    }
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).end(JSON.stringify({message: "errors.wrongPassword"}));
      return;
    }
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      config.jwtSecret,
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
  */

}
export default AuthController;
