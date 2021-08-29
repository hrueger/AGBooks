import { Router } from "express";
import BookController from "../controllers/BookController";
import { checkForAdmin } from "../middlewares/checkForAdmin";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

// Admin
router.get("/admin", [checkJwt, checkForAdmin], BookController.listAllAdmin);
router.post("/admin", [checkJwt, checkForAdmin], BookController.createBook);
router.post("/admin/:id", [checkJwt, checkForAdmin], BookController.editBook);
router.post("/admin/:id/cover", [checkJwt, checkForAdmin], BookController.uploadCover);
router.delete("/admin/:id/cover", [checkJwt, checkForAdmin], BookController.deleteCover);
router.delete("/admin/:id", [checkJwt, checkForAdmin], BookController.deleteBook);

// Usesrs
router.get("/", [checkJwt], BookController.listAll);
router.post("/list", BookController.availableBooks);
router.get("/:id", BookController.cover);

export default router;
