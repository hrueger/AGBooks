import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvalibleBooksComponent } from './avalible-books.component';

describe('AvalibleBooksComponent', () => {
  let component: AvalibleBooksComponent;
  let fixture: ComponentFixture<AvalibleBooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvalibleBooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvalibleBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
