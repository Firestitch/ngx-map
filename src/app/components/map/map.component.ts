import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Input, OnChanges, QueryList, SimpleChanges, ViewChild } from '@angular/core';

import { Subject } from 'rxjs';
import { map, take, takeUntil, tap } from 'rxjs/operators';

import { GoogleMap } from '@angular/google-maps';

import { FsMapMarkerDirective } from '../../directives';
import { FsMap } from '../../services';


@Component({
  selector: 'fs-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsMapComponent implements OnChanges {

  @ViewChild(GoogleMap)
  public googleMap: GoogleMap

  @ContentChildren(FsMapMarkerDirective)
  public mapMarkers: QueryList<FsMapMarkerDirective>

  @Input() public address: string;
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

  public addressMarker: {
    position: google.maps.LatLng,
  };

  private _destroy$ = new Subject();

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public constructor(
    private _map: FsMap,
    private _cdRef: ChangeDetectorRef,
  ) { }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.address) {
      this._map.loaded$
        .pipe(
          take(1),
          takeUntil(this._destroy$),
        )
        .subscribe(() => {
          const geocoder = new google.maps.Geocoder();

          geocoder.geocode({ 'address': this.address }, (results, status) => {
            if (status == 'OK') {
              const location = results[0]?.geometry?.location;

              if (location) {
                this.setCenter(location.lat(), location.lng());
                this.addressMarker = {
                  position: location
                };
              }
            }
          });
        });
    }
  }

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
    if (this.maxZoom) {
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
