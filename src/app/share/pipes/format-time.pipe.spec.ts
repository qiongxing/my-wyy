import { TestBed } from '@angular/core/testing';
import { FormatTimePipe } from './format-time.pipe';

fdescribe('FormatTimePipe', () => {
  
  it('transforms null to 00:00', () => {
    const pipe = new FormatTimePipe();
    expect(pipe.transform(null)).toEqual("00:00")
  });

  it('transforms 60 to 1:00', () => {
    const pipe = new FormatTimePipe();
    expect(pipe.transform(60)).toEqual("1:00")
  });
});
