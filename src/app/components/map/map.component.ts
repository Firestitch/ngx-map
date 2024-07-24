import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { guid } from '@firestitch/common';

import { Subject } from 'rxjs';
import { take, takeUntil, tap } from 'rxjs/operators';

import { toAddress } from '../../helpers';
import { FsMapOptions, MapAddress } from '../../interfaces';
import { FsMap } from '../../services';


@Component({
  selector: 'fs-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsMapComponent implements OnChanges, OnInit {

  @ViewChild('mapEl', { read: ElementRef, static: true })
  public mapEl: ElementRef;

  @Input() public address: string | MapAddress;
  @Input() public width: string = '100%';
  @Input() public height: string = '400px';
  @Input() public lat: number;
  @Input() public lng: number;
  @Input() public scrollwheel = true;
  @Input() public fullscreenControl = false;
  @Input() public streetViewControl = false;
  @Input() public zoomControl = true;
  @Input() public maxZoom: number;
  @Input() public zoom: number;
  @Input() public mapTypeControlOptions: google.maps.MapTypeControlOptions;
  @Input() public options: FsMapOptions = {};

  public map: google.maps.Map;

  public addressMarker: {
    position: google.maps.LatLng,
  };

  private _destroy$ = new Subject();

  constructor(
    private _map: FsMap,
    private _cdRef: ChangeDetectorRef,
  ) { }

  public ngOnInit(): void {
    this.loaded$
      .pipe(
        tap(() => this._init()),
      )
      .subscribe();
  }

  public mapInitialized(): void {
    setTimeout(() => {
      Object.keys(this.options?.events || [])
        .forEach((name) => {
          const eventName = name.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
          this.map.addListener(eventName, this.options.events[name]);
        });
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.address) {
      this._map.loaded$
        .pipe(
          take(1),
          takeUntil(this._destroy$),
        )
        .subscribe(() => {
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ 'address': toAddress(this.address) }, (results, status) => {
            if (status == 'OK') {
              const location = results[0]?.geometry?.location;

              if (location) {
                this.setCenter(location.lat(), location.lng());
                this.addressMarker = {
                  position: location,
                };
                this._cdRef.markForCheck();
              }
            }
          });
        });
    }
  }

  public get loaded$() {
    return this._map.loaded$
      .pipe(
        takeUntil(this._destroy$),
      );
  }

  public setCenter(lat: number, lng: number): void {
    this.lat = lat;
    this.lng = lng;
    this.map.setCenter(this.center);
  }

  public get center(): google.maps.LatLng {
    return this.lat && this.lng ? new google.maps.LatLng(this.lat, this.lng) : null;
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private _init(): void {
    if (this.maxZoom) {
      this.options.maxZoom = this.maxZoom;
    }

    this.options = {
      mapId: guid(),
      ...this.options,
      scrollwheel: this.options.scrollwheel ?? this.scrollwheel,
      streetViewControl: this.options.streetViewControl ?? this.streetViewControl,
      zoomControl: this.options.zoomControl ?? this.zoomControl,
      zoom: this.options.zoom ?? this.zoom,
      fullscreenControl: this.options.fullscreenControl ?? this.fullscreenControl,
      mapTypeControlOptions: this.options.mapTypeControlOptions ?? this.mapTypeControlOptions,
    };

    if(this.center) {
      this.options.center = this.center;
    }

    this.map = new google.maps.Map(this.mapEl.nativeElement as HTMLElement, this.options);
    this._initEvents();
  }
  
  private _initEvents():void {
    if(this.options.events) {
      [
        'boundsChanged',
        'centerChanged',
        'click',
        'contextmenu',
        'dblclick',
        'drag',
        'dragend',
        'dragstart',
        'headingChanged',
        'idle',
        'maptypeidChanged',
        'mousemove',
        'mouseout',
        'mouseover',
        'projectionChanged',
        'resize',
        'rightclick',
        'tilesloaded',
        'tiltChanged',
        'zoomChanged',
      ]
        .filter((name) => !!this.options.events[name])
        .forEach((name) => {
          const result = name.replace( /([A-Z])/g,' $1');
          const eventName = result.split(' ').join('_').toLowerCase();

          this.map.addListener(eventName, (event) => {
            this.options.events[name](event);
          });
        });
    }
  }
}
