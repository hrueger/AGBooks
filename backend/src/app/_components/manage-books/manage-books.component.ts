import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/_models/Book';
import { RemoteService } from 'src/app/_services/remote.service';

@Component({
  selector: 'app-manage-books',
  templateUrl: './manage-books.component.html',
  styleUrls: ['./manage-books.component.scss']
})
export class ManageBooksComponent implements OnInit {
  public books: Book[] = [];
  public apiUrl = "/api/";
  public subjects: string[] = [
    "Biologie",
    "Chemie",
    "Deutsch",
    "Englisch",
    "Ethik",
    "Französisch",
    "Geographie",
    "Geschichte",
    "Informatik",
    "Latein",
    "Mathematik",
    "Musik",
    "Physik",
    "Religion ev",
    "Religion rk",
    "Sozialkunde",
    "Spanisch",
    "Sport",
    "W&R"
  ];
  constructor(private remoteService: RemoteService) { }

  public ngOnInit(): void {
      this.remoteService.get("books/admin").subscribe((books: Book[]) => {
          this.books = books.map((b) => {
            for (const key of ["5", "6", "7", "8", "9", "10", "Q11", "Q12", "uebergang"]) {
              b[key] = b[key] == "1";
            }
            return b;
          });
      });
  }

  public newBook(): void {
      //
  }

  public removeBook(book: Book): void {
      // eslint-disable-next-line
      if (!confirm("Soll dieses Buch wirklich gelöscht werden?")) {
          return;
      }
      this.remoteService.delete(`auth/books/${book.id}`).subscribe(() => {
          this.ngOnInit();
      });
  }

}
