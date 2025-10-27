import { Component, Inject } from '@angular/core';
import { DrawerRef, DRAWER_DATA, DrawerDataProxy } from '@firestitch/drawer';
import { FsLabelModule } from '@firestitch/label';
import { FormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';


@Component({
    templateUrl: './configure.component.html',
    styleUrls: ['./configure.component.scss'],
    standalone: true,
    imports: [FsLabelModule, FormsModule, MatFormField, MatInput, MatButton]
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
