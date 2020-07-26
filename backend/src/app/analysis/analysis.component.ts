import { Component, OnInit } from "@angular/core";
import { RemoteService } from "../_services/remote.service";

@Component({
    selector: "app-analysis",
    styleUrls: ["./analysis.component.scss"],
    templateUrl: "./analysis.component.html",
})
export class AnalysisComponent implements OnInit {
  public orders: any[];
  public orderedBySubject: any[];
  public totalBooks = 0;
  public grades = [
      "5", "6", "7", "8", "9", "10", "Q11", "Q12",
  ];
  public total: number[] = [] as number[];
  public books: string[] = [] as string[];
  public subjects: string[] = [] as string[];
  public data: number[][][] = [[[]]]; // [subject][grade]
  public year = `${new Date().getFullYear()} / ${new Date().getFullYear() + 1}`;
  public showPrintOnly = false;
  constructor(private remoteService: RemoteService) { }

  public ngOnInit(): void {
      this.remoteService.getAnalysisData().subscribe((data: any) => {
          this.orders = data.orders;
          this.grades.forEach((grade) => {
              const gi = this.grades.indexOf(grade);
              this.orders.filter(
                  (order) => order.user.grade.startsWith(grade),
              )
                  .forEach((order) => {
                      order.order.forEach((book: any) => {
                          if (this.subjects.indexOf(book.subject) == -1) {
                              this.subjects.push(book.subject);
                          }
                          const si = this.subjects.indexOf(book.subject);
                          if (this.books.indexOf(book.name) == -1) {
                              this.books.push(book.name);
                          }
                          const bi = this.books.indexOf(book.name);
                          if (this.data[si]) {
                              if (this.data[si][gi]) {
                                  if (this.data[si][gi][bi]) {
                                      this.data[si][gi][bi] += parseInt(book.number);
                                  } else {
                                      this.data[si][gi][bi] = parseInt(book.number);
                                  }
                              } else {
                                  this.data[si][gi] = [];
                                  this.data[si][gi][bi] = parseInt(book.number);
                              }
                          } else {
                              this.data[si] = [];
                              this.data[si][gi] = [];
                              this.data[si][gi][bi] = parseInt(book.number);
                          }
                      });
                  });
          });
          this.grades.forEach((grade) => {
              const gi = this.grades.indexOf(grade);
              this.orders.filter((order) => order.user.grade.startsWith(grade)).forEach((order) => {
                  order.order.forEach((book: any) => {
                      this.total[gi] = (this.total[gi]
                          ? this.total[gi] + book.number
                          : book.number);
                      this.totalBooks += book.number;
                  });
              });
          });
      });
  }

  public print(): boolean {
      this.showPrintOnly = true;
      const that = this;
      // eslint-disable-next-line no-alert
      alert("Bitte schließen Sie diesen Dialog und drücken Sie dann Strg + P um die Seite zu drucken.");
      window.addEventListener("afterprint", () => {
          that.showPrintOnly = false;
      });
      return true;
  }
}
