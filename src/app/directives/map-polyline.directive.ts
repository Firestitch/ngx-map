import { AfterContentInit, Directive, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, inject } from '@angular/core';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FsMapComponent } from '../components';
import { FsMapPolylineOptions } from '../interfaces';
import { FsMap } from '../services';


@Directive({
  selector: 'fs-map-polyline',
  standalone: true,
})
export class FsMapPolylineDirective implements OnDestroy, OnChanges, AfterContentInit {

  @Input() public options: FsMapPolylineOptions = {};
  @Input() public path: google.maps.LatLng[];
  @Input() public curveStart: google.maps.LatLng;
  @Input() public curveEnd: google.maps.LatLng;
  @Input() public strokeColor: string = '#0000FF';
  @Input() public strokeWeight: number = 2;
  @Input() public geodesic = false;

  @Output() public click = new EventEmitter<google.maps.MapMouseEvent>();

  private _destroy$ = new Subject();  
  private _polyline$ = new BehaviorSubject<google.maps.Polyline>(null);
  private _map = inject(FsMapComponent);
  private _mapService = inject(FsMap);

  public get polyline$(): Observable<google.maps.Polyline> {
    return this._polyline$.asObservable();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if(
      (changes.path && !changes.path.firstChange)
    ) {
      this._createPolyline();
    }
  }

  public ngAfterContentInit(): void {
    this._mapService.loaded$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._createPolyline();
      });
  }
  
  public ngOnDestroy(): void {
    const polyline = this._polyline$.getValue();
    if(polyline) {
      polyline.setMap(null);
      this._polyline$.next(null);
    }
  }

  private _generateCurvedPath(from: google.maps.LatLng, to: google.maps.LatLng, percent = 15, side = 'right') {
  
    // Total distance in meters
    const distance = google.maps.geometry.spherical.computeDistanceBetween(from, to);
    const maxBulge = (distance * percent) / 100;
  
    // Heading from start → end
    const heading = google.maps.geometry.spherical.computeHeading(from, to);
  
    // 'right' = +90°, 'left' = -90° relative to the direction you're going
    const bulgeDirection = side === 'left' ? heading - 90 : heading + 90;
  
    const path = [];
    for (let i = 0; i <= 100; i++) {
      const fraction = i / 100;
  
      // Base point on straight line
      const base = google.maps.geometry.spherical.interpolate(from, to, fraction);
  
      // Perfectly centered sin wave (peaks at 50%)
      const bulge = Math.sin(fraction * Math.PI) * maxBulge;
  
      // Apply bulge perpendicular to the route
      const point = google.maps.geometry.spherical.computeOffset(base, bulge, bulgeDirection);
  
      path.push(point);
    }

    return path;
  }

  private _createPolyline(): void {
    let path = this.path;
    if(this.curveStart && this.curveEnd) {
      path = this._generateCurvedPath(this.curveStart, this.curveEnd);
    }

    const polyline = new google.maps.Polyline({
      path,
      geodesic: this.geodesic,         
      strokeColor: this.strokeColor,
      strokeWeight: this.strokeWeight,
      map: this._map.map,
    });

    if(this.click.observers.length) {
      polyline.addListener('click', (event) => {
        this.click.emit(event);
      });
    }

    this._polyline$.next(polyline);
  }
  
}
