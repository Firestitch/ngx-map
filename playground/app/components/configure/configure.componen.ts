import { Component, Inject } from '@angular/core';
import { DrawerRef, DRAWER_DATA, DrawerDataProxy } from '@firestitch/drawer';


@Component({
  templateUrl: './configure.component.html',
  styleUrls: ['./configure.component.scss']
})
export class ConfigureComponent {
  public config;

  public marker = {
    label: null,
    lon: null,
    lat: null,
    icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
  };

  constructor(public drawer: DrawerRef<ConfigureComponent>,
              @Inject(DRAWER_DATA) public data: DrawerDataProxy<any>) {
    this.config = data.config;
  }

  public add() {
    this.config.markers.push(this.marker);
  }

  public removeMarker(marker) {
    const markerIndex = this.config.markers.indexOf(marker);

    if (markerIndex !== -1) {
      this.config.markers.splice(markerIndex, 1);
    }
  }
}
