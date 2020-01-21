import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WyPlayerComponent } from './wy-player.component';

describe('WyPlayerComponent', () => {
  let component: WyPlayerComponent;
  let fixture: ComponentFixture<WyPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WyPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WyPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
