import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { toAddress } from '../helpers';
import { MapAddress } from '../interfaces';


@Directive({
  selector: '[fsMapLink]',
})
export class FsMapLinkDirective implements OnChanges {

  @Input() public target = '_blank';
  @Input() public address: string | MapAddress;

  public constructor(
    private _el: ElementRef,
  ) { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.address || changes.target) {
      const href = `https://www.google.com/maps/search/?api=1&query=${toAddress(this.address)}`;
      this._el.nativeElement.setAttribute('href', href);
      this._el.nativeElement.setAttribute('target', this.target);
    }
  }
}
