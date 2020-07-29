import { Book } from "./Book";
import { User } from "./User";

export class Order {
  public books: Book[];
  public user?: User;
}
