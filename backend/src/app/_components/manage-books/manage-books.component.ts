import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
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
    public imageChangedEvent: any = '';
    public editing = false;
    public currentBookId: number;
    public coverHash = Math.random().toString();
    public croppingPicture = false;
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
    public editingBackup: Book;
    private imageBase64: string;
    constructor(private remoteService: RemoteService, private alertService: AlertService, private modalService: NgbModal) { }

    public ngOnInit(): void {
        this.loading = true;
        this.remoteService.get("books/admin").subscribe((books: Book[]) => {
            this.gotBooks(books);
        });
    }

    public selectImage() {
        this.croppingPicture = true;
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.addEventListener("change", (event: Event) => {
            
            this.imageChangedEvent = event;
            console.log(input.files);
        });
        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
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

    public removeCover(): void {
        // eslint-disable-next-line
        if (!confirm("Soll dieses Buchcover wirklich entfernt werden?")) {
            return;
        }
        this.modalService.dismissAll();
        this.remoteService.delete(`books/admin/${this.currentBookId}/cover`).subscribe(() => {
            this.alertService.success("Das Buchcover wurde erfolgreich entfernt!");
            this.coverHash = Math.random().toString();
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

    public onImageCropped(event: ImageCroppedEvent) {
        this.imageBase64 = event.base64;
    }

    public uploadCroppedImage() {
        this.imageChangedEvent = "";
        this.remoteService.post(`books/admin/${this.currentBookId}/cover`, { cover: this.imageBase64 }).subscribe(() => {
            this.alertService.success("Das Buchcover wurde erfolgreich hochgeladen!");
            this.coverHash = Math.random().toString();
            this.croppingPicture = false;
        });
    }

    public openCoverModal(modal: unknown, book: Book) {
        this.currentBookId = book.id;
        this.modalService.open(modal).result.then(() => {
            this.croppingPicture = false;
            this.imageChangedEvent = "";
        }, () => {
            this.croppingPicture = false;
            this.imageChangedEvent = "";
        });
    }

}
