import { PlayCountPipe } from './play-count.pipe';
import { TestBed, inject } from '@angular/core/testing';

fdescribe('PlayCountPipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlayCountPipe]
    })
  })
  it('create an instance', () => {
    const pipe = new PlayCountPipe();
    expect(pipe).toBeTruthy();
  });
  it('number>10000显示万', inject([PlayCountPipe], (countPipe: PlayCountPipe) => {
    expect(countPipe.transform(20000)).toEqual('2万')
  }));
  it('传入边界值', () => {
    const pipe = new PlayCountPipe();
    expect(pipe.transform(2 ** 53 - 1)).toBeTruthy();
  })
}); 
