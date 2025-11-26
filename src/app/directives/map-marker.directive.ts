import { AfterContentInit, ContentChild, Directive, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, Output, SimpleChanges, inject } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsMapComponent } from '../components';
import { FsMapMarkerOptions } from '../interfaces';
import { FsMap } from '../services';

import { FsMapMarkerInfoWindowDirective } from './map-marker-info-window.directive';


@Directive({
  selector: 'fs-map-marker',
  standalone: true,
})
export class FsMapMarkerDirective implements OnDestroy, OnChanges, AfterContentInit, OnDestroy {

  @ContentChild(FsMapMarkerInfoWindowDirective) 
  public infoWindowDirective: FsMapMarkerInfoWindowDirective;

  @Input() public options: FsMapMarkerOptions = {};
  @Input() public lat: number;
  @Input() public lng: number;
  @Input() public zIndex: number = null;
  
  @Output() public click = new EventEmitter<google.maps.MapMouseEvent>();
  @Output() public drag = new EventEmitter<google.maps.MapMouseEvent>();
  @Output() public dragStart = new EventEmitter<google.maps.MapMouseEvent>();
  @Output() public dragEnd = new EventEmitter<google.maps.MapMouseEvent>();

  public advancedMarkerElement: google.maps.marker.AdvancedMarkerElement;

  private _destroy$ = new Subject();  
  private _el = inject(ElementRef);
  private _map = inject(FsMapComponent);
  private _mapService = inject(FsMap);
  private _infoWindow: google.maps.InfoWindow;

  @HostListener('click', ['$event']) 
  public onClick(event) {
    if(event.domEvent) {
      event.domEvent.preventDefault();
      event.domEvent.stopPropagation();
    } else {
      event.preventDefault();
      event.stopPropagation();
    }    
  }

  public get el(): HTMLElement {
    return this._el.nativeElement;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if(
      (changes.lat && !changes.lat.firstChange) || 
      (changes.lng && !changes.lng.firstChange)
    ) {
      this._createMarker();
    }
  }

  public onDestroy(): void {
    this._infoWindow?.close();
    this._infoWindow = null;
  }

  public ngAfterContentInit(): void {
    this._mapService.loaded$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._createMarker();
      });
  }
  
  public ngOnDestroy(): void {
    this.advancedMarkerElement?.remove();
    this._destroy$.next(null);
    this._destroy$.complete();
  }

  public get position(): google.maps.LatLng {
    return new google.maps.LatLng(this.lat, this.lng);
  }

  private _createMarker(): void {
    if(!this.lat || !this.lng) {
      return;
    }

    if(this.advancedMarkerElement) {
      this.advancedMarkerElement.content = this.el;
      this.advancedMarkerElement.position = {
        lat: this.lat,
        lng: this.lng,
      };     

      return;
    }

    this.advancedMarkerElement = new google.maps.marker
      .AdvancedMarkerElement({
        ...this.options,
        map: this._map.map,
        content: this.el,
        zIndex: this.zIndex,
        position: {
          lat: this.lat,
          lng: this.lng,
        },
      }); 

    this.advancedMarkerElement.element
      .classList.add('fs-map-marker-container');      

    if(this.click.observed) {
      this.advancedMarkerElement.addListener('click', (event) => {
        this.click.emit(event);
      });
    }

    if(this.drag.observed) {
      this.advancedMarkerElement.addListener('drag', (event) => {
        this.drag.emit(event);
      });
    }

    if(this.dragStart.observed) {
      this.advancedMarkerElement.addListener('dragstart', (event) => {
        this.dragStart.emit(event);
      });
    }

    if(this.dragEnd.observed) {
      this.advancedMarkerElement.addListener('dragend', (event) => {
        this.dragEnd.emit(event);
      });
    }
 
    if(this.infoWindowDirective) {
      this.infoWindowDirective
        .createInfoWindow(this.advancedMarkerElement);
    }
  }

}
