import { Directive, EventEmitter, Input, OnInit, Output } from '@angular/core';


@Directive({
  selector: 'fs-map-marker',
})
export class FsMapMarkerDirective implements OnInit {

  @Input() public options: google.maps.MarkerOptions = {};
  @Input() public lat: number;
  @Input() public lng: number;
  @Input() public label: string;

  @Output() public dragEnd = new EventEmitter<google.maps.MapMouseEvent>();

  public ngOnInit(): void {
    this.options.label = this.label;
  }

  public get position(): google.maps.LatLng {
    return new google.maps.LatLng(this.lat, this.lng);
  }

}
