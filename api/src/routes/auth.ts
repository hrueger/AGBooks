import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { checkJwt } from "../middlewares/checkJwt";
import { checkForAdmin } from "../middlewares/checkForAdmin";

const router = Router();
// Login route
router.post("/register", AuthController.register);
router.get("/userdata", [checkJwt], AuthController.getUserdata);
router.post("/userdata", [checkJwt], AuthController.setUserdata);
router.post("/login", AuthController.adminLogin);
router.post("/handover/code", [checkJwt], AuthController.getHandoverCode);
router.post("/handover/:id/code", [checkJwt, checkForAdmin], AuthController.getHandoverCodeForId);
router.get("/handover/live", [checkJwt], AuthController.handoverLive);
router.post("/takeover", [checkJwt], AuthController.takeover);

export default router;
