import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleComponent {

  public markers = [
      {
        lat: 43.642567,
        lng: -79.387054,
      },
    ];

}
