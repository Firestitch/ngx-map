import { ChangeDetectionStrategy, Component } from '@angular/core';

import { environment } from 'playground/environments/environment';
import { FsExampleModule } from '@firestitch/example';
import { ExampleComponent } from '../example/example.component';
import { AddressComponent } from '../address/address.component';
import { LinkComponent } from '../link/link.component';
import { StaticMapComponent } from '../static-map/static-map.component';


@Component({
    templateUrl: './examples.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FsExampleModule,
        ExampleComponent,
        AddressComponent,
        LinkComponent,
        StaticMapComponent,
    ],
})
export class ExamplesComponent {
  public config = environment;
}
