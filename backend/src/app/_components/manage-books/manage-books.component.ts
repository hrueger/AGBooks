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
    public loading = true;
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
        this.loading = true;
        this.remoteService.get("books/admin").subscribe((books: Book[]) => {
            this.gotBooks(books);
        });
    }

    private gotBooks(books: Book[]) {
        this.loading = false;
        this.books = books;
    }

    public newBook(): void {
        this.loading = true;
        this.remoteService.post(`books/admin`, {}).subscribe((books: Book[]) => {
            this.gotBooks(books);
            alert("Das Buch wurde erstellt. Es befindet sich wahrscheinlich ganz unten auf der Liste.")
        });
    }

    public removeBook(book: Book): void {
        // eslint-disable-next-line
        if (!confirm("Soll dieses Buch wirklich gelöscht werden?")) {
            return;
        }
        this.loading = true;
        this.remoteService.delete(`auth/books/${book.id}`).subscribe(() => {
            this.ngOnInit();
        });
    }

}
