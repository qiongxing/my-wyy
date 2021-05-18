import { Component, ElementRef, Renderer2, Type, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ClickoutsideDirective } from './clickoutside.directive';

@Component({
    template: `
        <div #elementRef (click)="onClick()" class="m-player" clickoutside (onClickOutSide)='onClickOutSide($event)'
        [bindFlag]="bindFlag">
        <button (click)="onClick()">name</button>
        
        </div>

    `,
})
class TestClickoutSideComponent {
    @ViewChild('elementRef', { static: true }) elementRef: ElementRef;
    bindFlag = false;
    onClickOutSide() {
        this.bindFlag = false;
    }
    onClick() {
        this.bindFlag = true;
    }
}

fdescribe('ClickousideDirective', () => {
    let fixture: ComponentFixture<TestClickoutSideComponent>;
    beforeEach(() => {
        fixture = TestBed.configureTestingModule({
            declarations: [ClickoutsideDirective, TestClickoutSideComponent]
        }).createComponent(TestClickoutSideComponent);
        fixture.detectChanges();
    })

    it('should bindFlag change false', () => {
        const app = fixture.componentInstance;
        const btn = fixture.nativeElement.querySelector('div');
        btn.click()
        // const renderer = fixture.componentRef.injector.get(Renderer2 as Type<Renderer2>);
        // const listenSpy = spyOn(renderer, 'listen').and.callFake(function (t, g, s) {
        //     return () => { 
        //         app.bindFlag=false;
        //     }
        // });
        // listenSpy();
        // expect(listenSpy).toHaveBeenCalled();
        let des = fixture.debugElement.queryAll(By.directive(ClickoutsideDirective));
        const test1 = des[0].injector.get(ClickoutsideDirective) as ClickoutsideDirective;
        test1.onClickOutSide.emit(btn);
        fixture.detectChanges();
        console.log(app.bindFlag);
        expect(app.bindFlag).toBeFalsy()
    })
});
