import { Router } from "express";
import auth from "./auth";
import tickets from "./books";
import user from "./user";

const routes = Router();

routes.use("/auth", auth);
routes.use("/books", tickets);
routes.use("/users", user);

export default routes;
