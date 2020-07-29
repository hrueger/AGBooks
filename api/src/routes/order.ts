import { Router } from "express";
import OrderController from "../controllers/OrderController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkForAdmin } from "../middlewares/checkForAdmin";

const router = Router();

router.get("/", [checkJwt], OrderController.forCheck);
router.get("/all", [checkJwt, checkForAdmin], OrderController.listAll);
router.post("/", [checkJwt], OrderController.order);
router.post("/submit", [checkJwt], OrderController.submit);
router.post("/:id/done", [checkJwt], OrderController.orderDone);
router.post("/:id/accepted", [checkJwt], OrderController.orderAccepted);

export default router;
