import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { config } from "../config/config";
import { User } from "../entity/User";

class AuthController {
  public static register = async (req: Request, res: Response): Promise<void> => {
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
