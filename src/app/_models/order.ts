import { Book } from "./book";
export class Order {
  public id: number;
  public class: String;
  public room: number;
  public teacher: String;
  public teacherShort: String;
  public books: Book[];
  public accepted: number;
  public done: number;
}
