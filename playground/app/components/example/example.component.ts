import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';

import { FsLabelModule } from '@firestitch/label';
import { FsMapComponent } from '@firestitch/map';

import { FsMapPolylineDirective, FsMapPolylineMarkerDirective } from 'src/app/directives';
import { FsMapOptions } from 'src/app/interfaces';

import { FsMapComponent as FsMapComponent_1 } from '../../../../src/app/components/map/map.component';
import { FsMapMarkerDirective } from '../../../../src/app/directives/map-marker.directive';


@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FsMapComponent_1,
    FsMapMarkerDirective,
    FsMapPolylineDirective,
    MatIcon,
    MatButton,
    FsLabelModule,
    FormsModule,
    MatCheckbox,
    FsLabelModule,
    FsMapPolylineMarkerDirective,
  ],
})
export class ExampleComponent implements OnInit {

  @ViewChild(FsMapComponent)
  public map: FsMapComponent;

  public lat;
  public markerLabel: string = 'Home';
  public lng;
  public options: FsMapOptions;
  public date;
  public config: any = {};

  public marker: {
    lat: number,
    lng: number, 
    options?: google.maps.marker.AdvancedMarkerElementOptions,
  };

  public markerIcon: {
    lat: number,
    lng: number, 
    options?: google.maps.marker.AdvancedMarkerElementOptions,
  };

  public points;

  private _cdRef = inject(ChangeDetectorRef);
  
  public ngOnInit(): void {
    this.lat = 43.642567;
    this.lng = -79.387054;
    this.points = [
      {
        lat: this.lat + 0.01,
        lng: this.lng + 0.08,
      },
      {
        lat: this.lat - 0.01,
        lng: this.lng - 0.08,
      },
    ];
    
    this.setCords(this.lat, this.lng);

    setTimeout(() => {
      this.setCords(this.lat, this.lng);
      this._cdRef.markForCheck();
    }, 2000);

    this.options = {
      events: {
        centerChanged: (event) => {
          console.log('centerChanged', event);
        },
      },
    };
  }

  public markerClick(): void {
    console.log('Marker clicked');
  }

  public polylineClick(): void {
    console.log('Polyline clicked');
  }

  public polylineMarkerClick(): void {
    console.log('Polyline marker clicked');
  }

  public setCords(lat: number, lng: number): void {
    this.marker = {
      lat,
      lng,
    };
    this.markerIcon = {
      lat: lat + .006,
      lng: lng,
    };
  }

  public center() {
    const cords = [
      [43.642567, -79.387054],
      [39.394338861287, -74.625363661872],
      [34.385328460357, -118.798470707419],
      [29.396358323352, -113.516759720574],
      [41.385308996934, -75.518567628843],
      [45.385338884002, -92.62606958483],
    ]
      .filter((cord) => this.lat !== cord[0]);

    const cord = cords[Math.floor(Math.random() * cords.length)];
    this.setCords(cord[0], cord[1]);
    this.map.setCenter(cord[0], cord[1]);
  }

}
