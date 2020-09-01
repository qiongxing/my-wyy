import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WyLayerDefaultComponent } from './wy-layer-default.component';

describe('WyLayerDefaultComponent', () => {
  let component: WyLayerDefaultComponent;
  let fixture: ComponentFixture<WyLayerDefaultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WyLayerDefaultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WyLayerDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
