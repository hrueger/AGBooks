import { Router } from "express";
import BookController from "../controllers/BookController";
import { checkForAdmin } from "../middlewares/checkForAdmin";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

// Admin
router.get("/admin", [checkJwt, checkForAdmin], BookController.listAllAdmin);
router.post("/admin", [checkJwt, checkForAdmin], BookController.createBook);

// Usesrs
router.get("/", [checkJwt], BookController.listAll);
router.post("/list", BookController.availableBooks);
router.get("/:id", BookController.cover);

export default router;
