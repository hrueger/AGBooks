import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Step7Component } from './step7.component';

describe('Step7Component', () => {
  let component: Step7Component;
  let fixture: ComponentFixture<Step7Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Step7Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Step7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
