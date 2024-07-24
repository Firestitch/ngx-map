import {
  Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output,
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsMapComponent } from '../components';
import { FsMapMarkerOptions } from '../interfaces';
import { FsMap } from '../services';


@Directive({
  selector: 'fs-map-marker',
})
export class FsMapMarkerDirective implements OnInit, OnDestroy {

  @Input() public options: FsMapMarkerOptions = {};
  @Input() public lat: number;
  @Input() public lng: number;
  
  @Output() public click = new EventEmitter<google.maps.MapMouseEvent>();
  @Output() public drag = new EventEmitter<google.maps.MapMouseEvent>();
  @Output() public dragStart = new EventEmitter<google.maps.MapMouseEvent>();
  @Output() public dragEnd = new EventEmitter<google.maps.MapMouseEvent>();

  public advancedMarkerElement: google.maps.marker.AdvancedMarkerElement;

  private _destroy$ = new Subject();

  constructor(
    private _el: ElementRef,
    private _map: FsMapComponent,
    private _mapService: FsMap,
  ) {}

  @HostListener('click', ['$event']) 
  public onClick(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  public ngOnInit(): void {
    this._mapService.loaded$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.advancedMarkerElement = new google.maps.marker.AdvancedMarkerElement({
          ...this.options,
          map: this._map.map,
          content: this._el.nativeElement,
          position: {
            lat: this.lat,
            lng: this.lng,
          },
        }); 

        this.advancedMarkerElement.element
          .classList.add('fs-map-marker-container');      

        if(this.click.observers.length) {
          this.advancedMarkerElement.addListener('click', (event) => {
            this.click.emit(event);
          });
        }

        if(this.drag.observers.length) {
          this.advancedMarkerElement.addListener('drag', (event) => {
            this.drag.emit(event);
          });
        }

        if(this.dragStart.observers.length) {
          this.advancedMarkerElement.addListener('dragstart', (event) => {
            this.dragStart.emit(event);
          });
        }

        if(this.dragEnd.observers.length) {
          this.advancedMarkerElement.addListener('dragend', (event) => {
            this.dragEnd.emit(event);
          });
        }
      });
  }
  
  public ngOnDestroy(): void {
    this.advancedMarkerElement?.remove();
    this._destroy$.next();
    this._destroy$.complete();
  }

  public get position(): google.maps.LatLng {
    return new google.maps.LatLng(this.lat, this.lng);
  }

}
