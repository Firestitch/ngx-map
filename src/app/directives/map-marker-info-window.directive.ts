import { Directive } from '@angular/core';


import { FsInfoWindowDirective } from './info-window.directive';


@Directive({
  selector: 'fs-map-marker-info-window',
  standalone: true,
})
export class FsMapMarkerInfoWindowDirective extends FsInfoWindowDirective {

}
