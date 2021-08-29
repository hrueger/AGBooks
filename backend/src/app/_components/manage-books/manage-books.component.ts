import { Component, OnInit } from '@angular/core';
import { Book } from 'src/app/_models/Book';
import { AlertService } from 'src/app/_services/alert.service';
import { RemoteService } from 'src/app/_services/remote.service';

@Component({
    selector: 'app-manage-books',
    templateUrl: './manage-books.component.html',
    styleUrls: ['./manage-books.component.scss']
})
export class ManageBooksComponent implements OnInit {
    public books: Book[] = [];
    public editing = false;
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
    editingBackup: {
        id: number; name: string; publisher: string; subject: string; short: string; language: string; branch: string; uebergang: string; 5: string; 6: string; 7: string; 8: string; 9: string; // eslint-disable-next-line
        // eslint-disable-next-line
        10: string; Q11: string; Q12: string; Q13: string; alert?: string; number?: number; editing?: boolean;
    };
    constructor(private remoteService: RemoteService, private alertService: AlertService) { }

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
            this.alertService.success("Das Buch wurde erstellt. Es befindet sich wahrscheinlich ganz unten auf der Liste.")
        });
    }

    public removeBook(book: Book): void {
        // eslint-disable-next-line
        if (!confirm("Soll dieses Buch wirklich gelöscht werden?")) {
            return;
        }
        this.loading = true;
        this.remoteService.delete(`books/admin/${book.id}`).subscribe(() => {
            this.ngOnInit();
            this.alertService.success("Das Buch wurde erfolgreich gelöscht!")
        });
    }

    public finishEditing(book: Book) {
        book.editing = false;
        this.editing = false;
        this.remoteService.post(`books/admin/${book.id}`, {...book}).subscribe(() => {
            this.ngOnInit();
            this.alertService.success("Das Buch wurde erfolgreich gespeichert!")
        });
    }

    public cancelEditing(book: Book) {
        book.editing = false;
        for (const [key, value] of Object.entries(this.editingBackup)) {
            book[key] = value;
        }
        this.editing = false;
    }

    public startEditing(book: Book) {
        this.editingBackup = { ...book };
        book.editing = true;
        this.editing = true;
    }

}
