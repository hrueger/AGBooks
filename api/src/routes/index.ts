import { Router } from "express";
import auth from "./auth";
import books from "./books";
import user from "./user";
import order from "./order";

const routes = Router();

routes.use("/auth", auth);
routes.use("/books", books);
routes.use("/order", order);
routes.use("/users", user);

export default routes;
