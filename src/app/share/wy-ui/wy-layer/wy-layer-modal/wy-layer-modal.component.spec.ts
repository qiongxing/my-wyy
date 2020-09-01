import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WyLayerModalComponent } from './wy-layer-modal.component';

describe('WyLayerModalComponent', () => {
  let component: WyLayerModalComponent;
  let fixture: ComponentFixture<WyLayerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WyLayerModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WyLayerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
