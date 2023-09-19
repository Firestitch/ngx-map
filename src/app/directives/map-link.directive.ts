import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';


@Directive({
  selector: '[fsMapLink]',
})
export class FsMapLinkDirective implements OnChanges {

  @Input() public target = '_blank';
  @Input() public address: string | {
    street?: string;
    city?: string;
    region?: string;
    zip?: string;
    country?: string;
  };

  public constructor(
    private _el: ElementRef,
  ) { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.address || changes.target) {
      const href = `https://www.google.com/maps/search/?api=1&query=${this.address}`;
      this._el.nativeElement.setAttribute('href', href);
      this._el.nativeElement.setAttribute('target', this.target);
    }
  }
}
