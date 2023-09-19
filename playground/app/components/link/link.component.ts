import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkComponent {

  public address = '1600 Pennsylvania Avenue, Washington DC';
}
