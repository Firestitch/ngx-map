import { DestroyRef, Directive, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, inject } from '@angular/core';

import { filter } from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FsMapComponent } from '../components';

import { FsMapPolylineDirective } from './map-polyline.directive';


@Directive({
  selector: '[fs-map-polyline-marker]',
  standalone: true,
})
export class FsMapPolylineMarkerDirective implements OnInit, OnDestroy {

  @Input() public offsetDegrees: number = 0;
  @Input() public positionPercent: number = 0.5;

  @Output() public click = new EventEmitter<google.maps.MapMouseEvent>();

  private _map = inject(FsMapComponent);
  private _content = inject(TemplateRef<any>);
  private _polyline = inject(FsMapPolylineDirective);
  private _destroyRef = inject(DestroyRef);
  private _marker: google.maps.marker.AdvancedMarkerElement;

  public ngOnInit(): void {
    this._polyline.polyline$
      .pipe(
        filter((polyline) => polyline !== null),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe((polyline) => {
        this._marker = this._placeIconOnPolyline(
          polyline, 
          this._map.map, 
          this._getHtmlFromTemplate(),
          this.offsetDegrees, 
          this.positionPercent,
        );
      });
  }

  public ngOnDestroy(): void {
    this._marker?.remove();
  }

  private _getHtmlFromTemplate(): string {
    const embeddedView = this._content.createEmbeddedView(null);
    embeddedView.detectChanges();
    
    let htmlContent = '';
    embeddedView.rootNodes.forEach((node: HTMLElement) => {
      if (node.outerHTML) {
        htmlContent += node.outerHTML;
      }
    });
    
    embeddedView.destroy();

    return htmlContent;
  }
  
  /**
 * Places a custom icon (emoji or PNG) at a specific position on a polyline,
 * perfectly rotated to match the curve's tangent direction.
 * 
 * @param polyline - The polyline to place the icon on
 * @param map - The map instance
 * @param htmlContent - HTML string containing emoji or <img> tag
 * @param offsetDegrees - Offset to apply to rotation (e.g., 90 to adjust icon orientation). Default is 0.
 * @param positionPercent - Position along the line as a percentage (0.0 to 1.0). 0.5 is the middle. Default is 0.5.
 * @returns The created marker
 */
  private _placeIconOnPolyline(
    polyline: google.maps.Polyline,
    map: google.maps.Map,
    htmlContent: string,
    offsetDegrees: number = 0,
    positionPercent: number = 0.5,
  ): google.maps.marker.AdvancedMarkerElement {
    const path = polyline.getPath();
    const pathArray = path.getArray();
  
    if (pathArray.length < 2) {
      throw new Error('Polyline must have at least 2 points');
    }
  
    // Validate positionPercent
    if (positionPercent < 0 || positionPercent > 1) {
      throw new Error('positionPercent must be between 0.0 and 1.0');
    }
  
    // Calculate distances and get target position
    const { distances, totalDistance } = this._calculateDistances(pathArray);
    const targetDistance = totalDistance * positionPercent;
  
    // Get exact position at the specified percentage
    const position = this._getPointAtDistance(pathArray, distances, targetDistance);
  
    // Calculate rotation angle at this position
    const heading = this._calculateHeading(
      pathArray,
      distances,
      totalDistance,
      targetDistance,
    );
  
    // Apply offset to heading
    const finalRotation = heading + offsetDegrees;
  
    // Create the marker with rotated content
    const content = this._createMarkerContent(htmlContent, finalRotation);
  
    const marker = new google.maps.marker.AdvancedMarkerElement({
      map: map,
      position: position,
      content: content,
    });
  
    if(this.click.observed) {
      marker.addListener('click', (event) => {
        this.click.emit(event);
      });
    }

    return marker;
  }

  /**
 * Calculates cumulative distances along the polyline
 */
  private _calculateDistances(
    pathArray: google.maps.LatLng[],
  ): { distances: number[]; totalDistance: number } {
    let totalDistance = 0;
    const distances: number[] = [0];
  
    for (let i = 0; i < pathArray.length - 1; i++) {
      const segmentDistance = google.maps.geometry.spherical.computeDistanceBetween(
        pathArray[i],
        pathArray[i + 1],
      );
      totalDistance += segmentDistance;
      distances.push(totalDistance);
    }
  
    return { distances, totalDistance };
  }

  /**
 * Gets a point at a specific distance along the polyline
 */
  private _getPointAtDistance(
    pathArray: google.maps.LatLng[],
    distances: number[],
    targetDistance: number,
  ): google.maps.LatLng {
    for (let i = 0; i < distances.length - 1; i++) {
      if (distances[i] <= targetDistance && targetDistance <= distances[i + 1]) {
        const start = pathArray[i];
        const end = pathArray[i + 1];
        const segDist = distances[i + 1] - distances[i];
        const distInto = targetDistance - distances[i];
        const frac = distInto / segDist;

        return google.maps.geometry.spherical.interpolate(start, end, frac);
      }
    }

    return pathArray[pathArray.length - 1];
  }

  /**
 * Calculates the heading (rotation angle) at a specific distance along the path
 */
  private _calculateHeading(
    pathArray: google.maps.LatLng[],
    distances: number[],
    totalDistance: number,
    targetDistance: number,
  ): number {
  // Sample distance for tangent calculation
    const sampleDistance = Math.max(
      Math.min(totalDistance * 0.01, 50), // 1% of path or 50m max
      10, // Minimum 10m to avoid noise
    );
  
    // beforeDistance comes BEFORE target (earlier in path)
    // afterDistance comes AFTER target (later in path)
    const beforeDistance = Math.max(0, targetDistance - sampleDistance);
    const afterDistance = Math.min(totalDistance, targetDistance + sampleDistance);
  
    const beforePoint = this._getPointAtDistance(pathArray, distances, beforeDistance);
    const afterPoint = this._getPointAtDistance(pathArray, distances, afterDistance);
  
    // computeHeading(from, to) returns the bearing FROM beforePoint TO afterPoint
    // This gives us the forward direction of travel along the path
    const heading = google.maps.geometry.spherical.computeHeading(beforePoint, afterPoint);
  
    return heading;
  }

  /**
 * Creates the HTML content structure for the marker
 */
  private _createMarkerContent(htmlContent: string, heading: number): HTMLElement {
    const rootContainer = document.createElement('div');
    rootContainer.style.cssText = `
    position: absolute;
    width: 40px;
    height: 40px;
    transform: translate(-50%, -50%);
  `;
  
    const rotationWrapper = document.createElement('div');
    rotationWrapper.style.cssText = `
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: rotate(${heading}deg);
    transform-origin: center center;
  `;
  
    const iconContent = document.createElement('div');
    iconContent.innerHTML = htmlContent;
    iconContent.style.cssText = `
    font-size: 32px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
    rotationWrapper.appendChild(iconContent);
    rootContainer.appendChild(rotationWrapper);
  
    return rootContainer;
  }
}
