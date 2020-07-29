import { Router } from "express";
import UserController from "../controllers/UserController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkForAdmin } from "../middlewares/checkForAdmin";

const router = Router();

router.get("/", [checkJwt], UserController.listAll);
router.post("/", [checkJwt, checkForAdmin], UserController.newUser);
router.post("/editCurrent", [checkJwt, checkForAdmin], UserController.editCurrent);
router.delete("/:id([0-9]+)", [checkJwt, checkForAdmin], UserController.deleteUser);

export default router;
