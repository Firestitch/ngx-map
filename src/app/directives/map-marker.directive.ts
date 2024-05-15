import { Directive, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FsMapComponent } from '../components';
import { FsMap } from '../services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FsMapMarkerOptions } from '../interfaces';


@Directive({
  selector: 'fs-map-marker',
})
export class FsMapMarkerDirective implements OnInit, OnDestroy, OnChanges {

  @HostListener('click', ['$event']) 
  onClick(event) {
    if(event.domEvent) {
      event.domEvent.preventDefault();
      event.domEvent.stopPropagation();
    } else {
      event.preventDefault();
      event.stopPropagation();
    }    
  }

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

  public constructor(
    private _el: ElementRef,
    private _map: FsMapComponent,
    private _mapService: FsMap,
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if(
        (changes.lat && !changes.lat.firstChange) || 
        (changes.lng && !changes.lng.firstChange)
    ) {
      this._createMarker();
    }
  }

  public ngOnInit(): void {
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
    this._destroy$.next();
    this._destroy$.complete();
  }

  public get position(): google.maps.LatLng {
    return new google.maps.LatLng(this.lat, this.lng);
  }

  private _createMarker(): void {
    const content = this._el.nativeElement.innerText ? this._el.nativeElement : null;

    if(this.advancedMarkerElement) {
      this.advancedMarkerElement.content = content;
      this.advancedMarkerElement.position = {
        lat: this.lat,
        lng: this.lng,
      };     

      return;
    }

    this.advancedMarkerElement = new google.maps.marker.AdvancedMarkerElement({
      ...this.options,
      map: this._map.map,
      content: content,
      zIndex: this.zIndex,
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
  }

}
