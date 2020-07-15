import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WyScrollComponent } from './wy-scroll.component';

describe('WyScrollComponent', () => {
  let component: WyScrollComponent;
  let fixture: ComponentFixture<WyScrollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WyScrollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WyScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
