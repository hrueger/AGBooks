import {
    Component, Directive, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren,
} from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { AuthenticationService } from "../../_services/authentication.service";
import { Book } from "../../_models/Book";
import { AlertService } from "../../_services/alert.service";
import { RemoteService } from "../../_services/remote.service";

export type SortColumn = keyof Book | any;
export type SortDirection = "asc" | "desc" | "";
const rotate: {[key: string]: SortDirection} = { asc: "desc", desc: "", "": "asc" };

const compare = (v1: string | number, v2: string | number) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
    selector: "th[sortable]",
    host: {
    "[class.asc]": "direction === \"asc\"",
    "[class.desc]": "direction === \"desc\"",
    "(click)": "rotate()",
    },
    })
export class NgbdSortableHeader {
    @Input() sortable: SortColumn = "";
    @Input() direction: SortDirection = "";
    @Output() sort = new EventEmitter<SortEvent>();

    public rotate(): void {
        this.direction = rotate[this.direction];
        console.log("rotate!");
        this.sort.emit({ column: this.sortable, direction: this.direction });
    }
}

@Component({
    selector: "app-manage-books",
    templateUrl: "./manage-books.component.html",
    styleUrls: ["./manage-books.component.scss"],
    })
export class ManageBooksComponent implements OnInit {
    public books: Book[] = [];
    public imageChangedEvent: any = "";
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
        "W&R",
    ];
    public editingBackup: Book;
    private imageBase64: string;
    private allBooks: Book[] = [];
    currentBook: Book;

    constructor(
        private remoteService: RemoteService,
        private alertService: AlertService,
        private modalService: NgbModal,
        public authService: AuthenticationService,
    ) { }

    public ngOnInit(skipLoading = false): void {
        if (!skipLoading) {
            this.loading = true;
        }
        this.remoteService.get("books/admin").subscribe((books: Book[]) => {
            this.gotBooks(books);
        });
    }

    public selectImage(): void {
        this.croppingPicture = true;
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.addEventListener("change", (event: Event) => {
            this.imageChangedEvent = event;
        });
        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    }

    public importBackup(): void {
        // select a zip file and upload it with a post request as base64
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".zip";
        input.addEventListener("change", (event: Event) => {
            this.loading = true;
            const file = (event.target as HTMLInputElement).files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                this.remoteService.post("books/admin/backup/import", { backupBase64: reader.result }).subscribe(() => {
                    this.ngOnInit();
                    this.alertService.success("Das Backup wurde erfolgreich importiert!");
                });
            };
        });
        document.body.appendChild(input);
        input.click();
        document.body.removeChild(input);
    }

    private gotBooks(books: Book[]) {
        this.loading = false;
        this.books = books;
        this.allBooks = books;
    }

    public newBook(): void {
        this.loading = true;
        this.remoteService.post("books/admin", {}).subscribe((books: Book[]) => {
            this.gotBooks(books);
            this.alertService.success("Das Buch wurde erstellt. Es befindet sich wahrscheinlich ganz unten auf der Liste.");
        });
    }

    public removeBook(book: Book): void {
        // eslint-disable-next-line
        if (!confirm("Soll dieses Buch wirklich gelöscht werden?")) {
            return;
        }
        this.remoteService.delete(`books/admin/${book.id}`).subscribe(() => {
            this.ngOnInit(true);
            this.alertService.success("Das Buch wurde erfolgreich gelöscht!");
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

    public finishEditing(book: Book): void {
        book.editing = false;
        this.editing = false;
        this.remoteService.post(`books/admin/${book.id}`, { ...book }).subscribe(() => {
            this.ngOnInit(true);
            this.alertService.success("Das Buch wurde erfolgreich gespeichert!");
        });
    }

    public cancelEditing(book: Book): void {
        book.editing = false;
        for (const [key, value] of Object.entries(this.editingBackup)) {
            book[key] = value;
        }
        this.editing = false;
    }

    public startEditing(book: Book, modal: any): void {
        this.editingBackup = { ...book };
        this.currentBook = book;
        this.modalService.open(modal, { size: "lg" }).result.then(() => {
            this.finishEditing(book);
            console.log("finish");
        }, () => {
            console.log("this.cancelEditing");
            this.cancelEditing(book);
        });
    }

    public onImageCropped(event: ImageCroppedEvent): void {
        this.imageBase64 = event.base64;
    }

    public uploadCroppedImage(): void {
        this.imageChangedEvent = "";
        this.remoteService.post(`books/admin/${this.currentBookId}/cover`, { cover: this.imageBase64 }).subscribe(() => {
            this.alertService.success("Das Buchcover wurde erfolgreich hochgeladen!");
            this.coverHash = Math.random().toString();
            this.croppingPicture = false;
        });
    }

    public openCoverModal(modal: unknown, book: Book): void {
        this.currentBookId = book.id;
        this.modalService.open(modal).result.then(() => {
            this.croppingPicture = false;
            this.imageChangedEvent = "";
        }, () => {
            this.croppingPicture = false;
            this.imageChangedEvent = "";
        });
    }

    @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

    onSort({ column, direction }: any): void {
        this.headers.forEach((header) => {
            if (header.sortable !== column) {
                header.direction = "";
            }
        });

        // sorting countries
        if (direction === "" || column === "") {
            this.books = this.allBooks;
        } else {
            this.books = [...this.allBooks].sort((a, b) => {
                const res = compare(a[column as any], b[column as any]);
                return direction === "asc" ? res : -res;
            });
        }
    }
}
