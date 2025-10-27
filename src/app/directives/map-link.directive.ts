import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';

import { toAddress } from '../helpers';
import { MapAddress } from '../interfaces';


@Directive({
    selector: '[fsMapLink]',
    standalone: true,
})
export class FsMapLinkDirective implements OnChanges {

  @Input() public target = '_blank';
  @Input() public address: string | MapAddress;
  @Input() public lat: number;
  @Input() public lng: number;

  constructor(
    private _el: ElementRef,
  ) { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.address || changes.target || changes.lng || changes.lat) {

      let href;
      if(this.lng && this.lat) {
        href = `https://www.google.com/maps/search/?api=1&query=${this.lat},${this.lng}`;
      } else if(this.address) {
        href = `https://www.google.com/maps/search/?api=1&query=${toAddress(this.address)}`;
      }

      if(href) {
        this._el.nativeElement.setAttribute('href', href);
        this._el.nativeElement.setAttribute('target', this.target);
      }
    }
  }
}
