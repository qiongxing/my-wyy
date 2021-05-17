import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { NzToolTipModule } from 'ng-zorro-antd';
import { WySliderModule } from '../wy-slider/wy-slider.module';
import { WyUiModule } from '../wy-ui.module';

import { WyPlayerComponent } from './wy-player.component';

describe('WyPlayerComponent', () => {
  let component: WyPlayerComponent;
  let fixture: ComponentFixture<WyPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WyPlayerComponent],
      imports: [
        CommonModule,
        WySliderModule,
        FormsModule,
        NzToolTipModule,
        WyUiModule
      ],
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
