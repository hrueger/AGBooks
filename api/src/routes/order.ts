import { Router } from "express";
import OrderController from "../controllers/OrderController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.get("/", [checkJwt], OrderController.forCheck);
router.post("/", [checkJwt], OrderController.order);

export default router;
