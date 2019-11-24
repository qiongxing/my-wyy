import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WyCarouselComponent } from './wy-carousel.component';

describe('WyCarouselComponent', () => {
  let component: WyCarouselComponent;
  let fixture: ComponentFixture<WyCarouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WyCarouselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WyCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
