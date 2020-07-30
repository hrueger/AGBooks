import { Router } from "express";
import OrderController from "../controllers/OrderController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkForAdmin } from "../middlewares/checkForAdmin";

const router = Router();

router.get("/", [checkJwt], OrderController.forCheck);
router.get("/all", [checkJwt, checkForAdmin], OrderController.listAll);
router.get("/all/live", [checkJwt, checkForAdmin], OrderController.listAllLive);
router.get("/live", [checkJwt], OrderController.live);
router.post("/", [checkJwt], OrderController.order);
router.post("/submit", [checkJwt], OrderController.submit);
router.post("/accept", [checkJwt], OrderController.accept);
router.post("/:id/done", [checkJwt, checkForAdmin], OrderController.orderDone);
router.post("/:id/accepted", [checkJwt, checkForAdmin], OrderController.orderAccepted);
router.delete("/:id", [checkJwt, checkForAdmin], OrderController.deleteOrder);

export default router;
