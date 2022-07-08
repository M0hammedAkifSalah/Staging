import { Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from "@angular/core";
import { Subject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";
import { MathContent } from "./mathjax.interface";
import { MathServiceImpl } from "./mathjax.service";

@Directive({
    selector: '[appMath]'
})
export class MathDirective implements OnChanges, OnDestroy {
    private alive$ = new Subject<boolean>();

    // @Input()
    // private appMath: MathContent;
    // private readonly _el: HTMLElement;

    // constructor(private service: MathServiceImpl,
    //     private el: ElementRef) {
    //     this._el = el.nativeElement as HTMLElement;
    // }

    // ngOnInit(): void {
    //     this.service
    //         .ready()
    //         .pipe(
    //             take(1),
    //             takeUntil(this.alive$)
    //         ).subscribe(res => {
    //             this.service.render(this._el, this.appMath);
    //         });
    // }

    // ngOnChanges(changes: SimpleChanges): void {
    //     console.log(changes);
    // }

    ngOnDestroy(): void {
        this.alive$.next(false);
    }
    @Input(' MathJax')
    texExpression: string;

    constructor(private el: ElementRef, private service: MathServiceImpl) {
    }

    ngOnChanges() {
        this.el.nativeElement.innerHTML = this.texExpression;
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.el.nativeElement]);
    }
}