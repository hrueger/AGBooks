import { Book } from "./book";
export class Order {
  id: number;
  class: String;
  room: number;
  teacher: String;
  teacherShort: String;
  books: Book[];
  accepted: number;
  done: number;
}
