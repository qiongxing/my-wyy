import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleSheetComponent } from './single-sheet.component';

describe('SingleSheetComponent', () => {
  let component: SingleSheetComponent;
  let fixture: ComponentFixture<SingleSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
