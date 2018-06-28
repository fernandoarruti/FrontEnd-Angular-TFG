import { AfterViewInit, ElementRef, OnChanges, Renderer2, SimpleChanges } from '@angular/core';
export declare class NgOptionHighlightDirective implements OnChanges, AfterViewInit {
    private elementRef;
    private renderer;
    term: string;
    private element;
    private label;
    constructor(elementRef: ElementRef, renderer: Renderer2);
    ngOnChanges(changes: SimpleChanges): void;
    ngAfterViewInit(): void;
    private _highlightLabelWithSearchTerm();
    private _setInnerHtml(html);
}
