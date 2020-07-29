import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { checkJwt } from "../middlewares/checkJwt";

const router = Router();
// Login route
router.post("/register", AuthController.register);
router.get("/userdata", [checkJwt], AuthController.getUserdata);
router.post("/userdata", [checkJwt], AuthController.setUserdata);
router.post("/login", AuthController.adminLogin);
router.post("/handover/code", [checkJwt], AuthController.getHandoverCode);

export default router;
