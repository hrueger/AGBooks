import { Book } from "./book";

export class Order {
  public id: number;
  public class: string;
  public room: number;
  public teacher: string;
  public teacherShort: string;
  public books: Book[];
  public accepted: number;
  public done: number;
  public user?: any;
}
