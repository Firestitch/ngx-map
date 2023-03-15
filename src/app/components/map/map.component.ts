import { Input, ChangeDetectionStrategy, Component, ContentChildren, QueryList, ViewChild, ChangeDetectorRef } from '@angular/core';

import { Subject } from 'rxjs';
import { map, tap, takeUntil } from 'rxjs/operators';

import { GoogleMap } from '@angular/google-maps';

import { FsMapMarkerDirective } from '../../directives';
import { FsMap } from '../../services';


@Component({
  selector: 'fs-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsMapComponent {

  @ViewChild(GoogleMap)
  public googleMap: GoogleMap

  @ContentChildren(FsMapMarkerDirective)
  public mapMarkers: QueryList<FsMapMarkerDirective>

  @Input() public width: string;
  @Input() public height: string;
  @Input() public lat: number;
  @Input() public lng: number;
  @Input() public scrollwheel = true;
  @Input() public fullscreenControl = false;
  @Input() public streetViewControl = false;
  @Input() public zoomControl = true;
  @Input() public maxZoom: number;
  @Input() public zoom: number;
  @Input() public mapTypeControlOptions: google.maps.MapTypeControlOptions;
  @Input() public options: google.maps.MapOptions = {};

  private _destroy$ = new Subject();
  
  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  constructor(
    private _map: FsMap,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public get loaded$() {
    return this._map.loaded$
      .pipe(
        tap(() => this._initOptions()),
        map(() => true),        
        takeUntil(this._destroy$),
      );
  }

  public setCenter(lat: number, lng: number): void {
    this.lat = lat;
    this.lng = lng;
    this._cdRef.markForCheck();
  }

  public get center(): google.maps.LatLng {
    return new google.maps.LatLng(this.lat, this.lng);
  }

  private _initOptions(): void {
    if(this.maxZoom) {
      this.options.maxZoom = this.maxZoom;
    }
    
    this.options = {
      ...this.options,
      scrollwheel: this.scrollwheel,
      streetViewControl: this.streetViewControl,
      zoomControl: this.zoomControl,
      zoom: this.zoom,
      fullscreenControl: this.fullscreenControl,
      mapTypeControlOptions: this.mapTypeControlOptions,
    }
  }
}
