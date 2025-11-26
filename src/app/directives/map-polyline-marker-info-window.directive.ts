import { AfterContentInit, Directive, ElementRef, inject } from '@angular/core';


import { FsInfoWindowDirective } from './info-window.directive';
import { FsMapPolylineMarkerDirective } from './map-polyline-marker.directive';


@Directive({
  selector: 'fs-map-polyline-marker-info-window',
  standalone: true,
})
export class FsMapPolylineMarkerInfoWindowDirective 
  extends FsInfoWindowDirective implements AfterContentInit {
    
  protected _el = inject(ElementRef);
  protected _polylineMarker = inject(FsMapPolylineMarkerDirective);

  public ngAfterContentInit(): void {
    // let lng: number;
    // let lat: number;
  
    // if(this._polylineMarker.marker.position instanceof google.maps.LatLng) {
    //   lng = this._polylineMarker.marker.position.lng();
    //   lat = this._polylineMarker.marker.position.lat();
    // } else {
    //   lng = this._polylineMarker.marker.position.lng;
    //   lat = this._polylineMarker.marker.position.lat;
    // }

    // this._createInfoWindow(
    //   this._el.nativeElement, 
    //   this._polylineMarker.marker, 
    //   lat, 
    //   lng,
    // );
  }
}
