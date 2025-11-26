import { Directive, ElementRef, OnDestroy, inject } from '@angular/core';


import { FsMapComponent } from '../components';


@Directive({
  standalone: true,
})
export class FsInfoWindowDirective implements OnDestroy {

  protected _map = inject(FsMapComponent);
  protected _infoWindow: google.maps.InfoWindow;
  protected _el = inject(ElementRef);
  protected _marker: google.maps.marker.AdvancedMarkerElement;
  private _closeTimeoutId: number;
  private _mouseEnter: () => void;
  private _mouseLeave: () => void;
  
  public ngOnDestroy(): void {
    this._infoWindow?.close();
    this._infoWindow = null;
    this._marker.removeEventListener('mouseenter', this._mouseEnter);
    this._marker.removeEventListener('mouseleave', this._mouseLeave);
  }

  public createInfoWindow(
    marker: google.maps.marker.AdvancedMarkerElement, 
  ): void {
    this._marker = marker;
    this._mouseEnter = () => {
      clearTimeout(this._closeTimeoutId);
      this._infoWindow?.close();
      this._infoWindow = new google.maps.InfoWindow();
      this._infoWindow.setContent(this._el.nativeElement);    
      this._infoWindow.setOptions({
        headerDisabled: true,
      });
      
      this._infoWindow.addListener('domready', () => {
        this._el.nativeElement.parentElement.parentElement
          .addEventListener('mouseenter', () => {
            clearTimeout(this._closeTimeoutId);
            this._marker
              .removeEventListener('mouseleave', this._mouseLeave);
          });

        this._el.nativeElement.parentElement.parentElement
          .addEventListener('mouseleave', () => {
            this._closeInfoWindow();
          });
      });

      if(this._mouseLeave) {
        this._marker
          .removeEventListener('mouseleave', this._mouseLeave);
      }

      this._marker
        .addEventListener('mouseleave', this._mouseLeave);
        
      this._infoWindow.open({
        map: this._map.map,
        anchor: this._marker,
      });
    };

    this._mouseLeave = () => {
      this._closeInfoWindow();
    };

    this._marker
      .addEventListener('mouseenter', this._mouseEnter);
  }

  private _closeInfoWindow(): void {
    this._closeTimeoutId = setTimeout(() => {
      this._infoWindow?.close();
      this._infoWindow = null;
    }, 500);
  }
}
