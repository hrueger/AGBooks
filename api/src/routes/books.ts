import { Router } from "express";
import BookController from "../controllers/BookController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.get("/", [checkJwt], BookController.listAll);
router.get("/:id", BookController.cover);

export default router;
