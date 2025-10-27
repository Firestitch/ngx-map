import {
  AfterViewInit,
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, HostBinding, inject, Input,
  ViewChild,
} from '@angular/core';

import { debounceTime, Observable } from 'rxjs';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FS_MAP_GOOGLE_MAP_KEY } from '../../injectors';
import { FsMapOptions, MapAddress } from '../../interfaces';


@Component({
    selector: 'fs-map-static',
    templateUrl: './map-static.component.html',
    styleUrls: ['./map-static.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
})
export class FsMapStaticComponent implements AfterViewInit {

  @Input() 
  @HostBinding('style.height')
  public height: string = '100%';

  @Input() 
  @HostBinding('style.width')
  public width: string = '100%';

  @Input() 
  @HostBinding('style.position')
  public position: 'relative' | 'absolute' | 'fixed' = 'relative';

  @ViewChild('mapEl', { read: ElementRef, static: true })
  public mapEl: ElementRef;

  @Input() public address: string | MapAddress;
  @Input() public lat: number;
  @Input() public lng: number;
  @Input() public zoom: number;
  @Input() public options: FsMapOptions = {};

  public map: google.maps.Map;

  private _googleMapKey = inject(FS_MAP_GOOGLE_MAP_KEY);
  private _destroyRef = inject(DestroyRef);

  public ngAfterViewInit(): void {
    this.drawWallpaper();

    const size$ = new Observable((subscriber) => {
      const ro = new ResizeObserver(() => {
        subscriber.next();
      });
      
      ro.observe(this.mapEl.nativeElement);

      return () => ro.disconnect();
    });

    size$
      .pipe(
        debounceTime(100),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe(() => {
        this.drawWallpaper();
      });
  }

  /**
   * Convert lat/lng to fractional tile coordinates at a given zoom.
   * Ref: https://developers.google.com/maps/documentation/javascript/coordinates
   */
  public latLngToTileXY(lat: number, lng: number, zoom: number) {
    const n = 2 ** zoom;
    const x = n * ((lng + 180) / 360);
    const latRad = lat * Math.PI / 180;
    const y = n * (1 - (Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI)) / 2;

    return { x, y };
  }

  public drawWallpaper() {
    const mapEl = this.mapEl.nativeElement;
    mapEl.innerHTML = ''; // clear any previous tiles

    const tileSize = 256;
    const cols = Math.ceil(mapEl.offsetWidth  / tileSize) + 2; // +2 for overscan
    const rows = Math.ceil(mapEl.offsetHeight / tileSize) + 2;

    // Centre tile’s fractional position
    const centre = this.latLngToTileXY(this.lat, this.lng, this.zoom);
    const centreX = Math.floor(centre.x);
    const centreY = Math.floor(centre.y);

    // Upper-left tile index so that the centre tile ends up centred
    const startCol = centreX - Math.floor(cols / 2);
    const startRow = centreY - Math.floor(rows / 2);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const xIdx = startCol + col;
        const yIdx = startRow + row;

        // Google’s static tile endpoint (undocumented; OK for lightweight demos,
        // but production apps must use the official Static Maps API billing model)
        const url = `https://mt0.google.com/vt/lyrs=s&x=${xIdx}&y=${yIdx}&z=${this.zoom}&scale=2&key=${this._googleMapKey}`;

        const img = document.createElement('img');
        img.src = url;
        img.style.left = `${col * tileSize - (centre.x - centreX) * tileSize}px`;
        img.style.top  = `${row * tileSize - (centre.y - centreY) * tileSize}px`;
        this.mapEl.nativeElement.appendChild(img);
      }
    }
  }

}
