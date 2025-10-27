import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FsMapStaticComponent } from '../../../../src/app/components/map-static/map-static.component';


@Component({
    selector: 'app-static-map',
    templateUrl: './static-map.component.html',
    styleUrls: ['./static-map.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FsMapStaticComponent],
})
export class StaticMapComponent {

}
