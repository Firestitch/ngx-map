import { Directive, ElementRef, OnDestroy, inject } from '@angular/core';


import { FsMapComponent } from '../components';


@Directive({
  standalone: true,
})
export class FsInfoWindowDirective implements OnDestroy {

  protected _map = inject(FsMapComponent);
  protected _infoWindow: google.maps.InfoWindow;
  protected _el = inject(ElementRef);
  
  public ngOnDestroy(): void {
    this._infoWindow?.close();
    this._infoWindow = null;
  }

  public createInfoWindow(
    marker: google.maps.marker.AdvancedMarkerElement, 
    lat: number, 
    lng: number,
  ): void {
    marker.element
      .addEventListener('mouseenter', () => {
        this._infoWindow?.close();
        this._infoWindow = new google.maps.InfoWindow();
        this._infoWindow.setContent(this._el.nativeElement);    
        this._infoWindow.setOptions({
          headerDisabled: true,
          position: { lat, lng },
        });

        this._infoWindow.addListener('domready', () => {
          this._el.nativeElement.parentElement.parentElement
            .addEventListener('mouseleave', () => {
              setTimeout(() => {
                this._infoWindow?.close();
                this._infoWindow = null;
              }, 500);
            });
        });

        this._infoWindow.open({
          map: this._map.map,
        });

      });
  }

}
