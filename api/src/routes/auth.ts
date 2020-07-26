import { Router } from "express";
import AuthController from "../controllers/AuthController";

const router = Router();
// Login route
router.post("/register", AuthController.register);
// router.post("/admin/login", AuthController.adminLogin);

export default router;
