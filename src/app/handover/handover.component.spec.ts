import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HandoverComponent } from './handover.component';

describe('HandoverComponent', () => {
  let component: HandoverComponent;
  let fixture: ComponentFixture<HandoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
