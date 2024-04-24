import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { FsMapComponent } from '@firestitch/map';
import { FsMapOptions } from 'src/app/interfaces';


@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleComponent implements OnInit {

  @ViewChild(FsMapComponent)
  public map: FsMapComponent;

  public lat;
  public lng;
  public options: FsMapOptions;

  public markers = [];

  public ngOnInit(): void {
    this.setCords(43.642567, -79.387054);

    this.options = {
      events: {
        centerChanged: (event) => {
        }
      }
    };
  }

  public setCords(lat, lng): void {
    this.lat = 43.642567;
    this.lng = -79.387054;
    this.markers = [
      {
        lat: this.lat,
        lng: this.lng,
      },
    ];
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
    this.map.setCenter(cord[0], cord[1]);
  }

}
