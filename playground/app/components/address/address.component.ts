import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressComponent {

  public address = 'Statue of Liberty, Liberty Island New York, NY 10004';

}
