import { AfterViewInit, Component } from '@angular/core';
import { ConfigureComponent } from '../configure/configure.componen';
import { FsExampleComponent } from '@firestitch/example';


@Component({
  selector: 'app-example',
  templateUrl: 'example.component.html',
  styleUrls: ['example.component.scss']
})
export class ExampleComponent implements AfterViewInit {

  public config = {
    markers: [
      {
        lat: '53.366201',
        lon: '-107.529087',
      },
      {
        lat: '53.360392',
        lon: '-107.511176',
      }
    ],
  };

  constructor(private example: FsExampleComponent) {}

  public ngAfterViewInit() {
    this.example.setConfigureComponent(ConfigureComponent, {
      config: this.config
    });
  }
}
