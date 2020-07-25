import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeoverComponent } from './takeover.component';

describe('TakeoverComponent', () => {
  let component: TakeoverComponent;
  let fixture: ComponentFixture<TakeoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TakeoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
