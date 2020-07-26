import { validate } from "class-validator";
import { Request, Response } from "express";
import { getRepository } from "typeorm";
import { Admin } from "../entity/Admin";

class AdminController {
  public static listAll = async (req: Request, res: Response): Promise<void> => {
      const userRepository = getRepository(Admin);
      const users = await userRepository.find();
      res.send(users);
  }

  public static newUser = async (req: Request, res: Response): Promise<void> => {
      const {
          username, pw, pw2, email,
      } = req.body;
      if (!(username && email && pw && pw2)) {
          res.status(400).send({ message: "errors.notAllFieldsProvided" });
          return;
      }
      if (pw != pw2) {
          res.status(400).send({ message: "errors.passwordsDontMatch" });
          return;
      }

      const user = new Admin();
      user.email = email;
      user.password = pw;

      user.hashPassword();

      const userRepository = getRepository(Admin);
      try {
          await userRepository.save(user);
      } catch (e) {
          res.status(409).send({ message: "errors.existingUsername" });
          return;
      }
      res.status(200).send({ status: true });
  }

  public static editCurrent = async (req: Request, res: Response): Promise<void> => {
      const id = res.locals.jwtPayload.userId;

      const {
          username, email, pwNew, pwNew2, pwOld,
      } = req.body;

      const userRepository = getRepository(Admin);
      let user;
      try {
          user = await userRepository.createQueryBuilder("user")
              .addSelect("user.password")
              .where("user.id = :id", { id })
              .getOne();
      } catch (error) {
          res.status(404).send({ message: "errors.userNotFound" });
          return;
      }

      if (!(username && email && pwOld)) {
          res.status(400).send({ message: "errors.notAllFieldsProvided" });
      }

      if (pwNew != pwNew2) {
          res.status(400).send({ message: "errors.passwordsDontMatch" });
          return;
      }

      if (!user.checkIfUnencryptedPasswordIsValid(pwOld)) {
          res.status(401).send({ message: "errors.oldPasswordWrong" });
          return;
      }

      // Validate the new values on model
      user.username = username;
      user.email = email;
      if (pwNew && pwNew2) {
          user.password = pwNew;
          user.hashPassword();
      }
      const errors = await validate(user);
      if (errors.length > 0) {
          const ers = errors.map((e) => e.toString);
          res.status(400).send({ message: ers.join(", ") });
          return;
      }

      try {
          await userRepository.save(user);
      } catch (e) {
          res.status(409).send({ message: "errors.existingUsername" });
          return;
      }

      res.status(200).send({ status: true });
  }

  public static deleteUser = async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;

      const userRepository = getRepository(Admin);
      try {
          await userRepository.delete(id);
      } catch (e) {
          res.status(500).send({ message: "errors.errorWhileDeletingUser" });
          return;
      }

      res.status(200).send({ status: true });
  }
}

export default AdminController;
