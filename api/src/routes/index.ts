import { Router } from "express";
import auth from "./auth";
import tickets from "./tickets";
import user from "./user";

const routes = Router();

routes.use("/auth", auth);
routes.use("/tickets", tickets);
routes.use("/users", user);

export default routes;
