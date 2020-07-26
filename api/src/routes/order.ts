import { Router } from "express";
import OrderController from "../controllers/OrderController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();

router.post("/", [checkJwt], OrderController.order);

export default router;
