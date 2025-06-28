import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
  selector: 'app-static-map',
  templateUrl: './static-map.component.html',
  styleUrls: ['./static-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StaticMapComponent {

}
