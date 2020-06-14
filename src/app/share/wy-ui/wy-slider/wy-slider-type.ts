import { Observer, Observable } from 'rxjs'

export type WySliderStyle = {
    bottom?: string | null;
    height?: string | null;
    width?: string | null;
    left?: string | null;
}
export type WySliderMouseObserver = {
    start: string;
    move: string;
    end: string;
    filter: (e: Event) => boolean;
    pluckKey: string[];
    startPlucked$?: Observable<number>;
    moveResolved$?: Observable<number>;
    end$?: Observable<Event>;

}
export type SliderValue = number | null;