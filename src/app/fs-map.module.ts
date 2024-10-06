import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { provideHttpClient, withJsonpSupport } from '@angular/common/http';

import { FsMapComponent } from './components';
import { FsMapLinkDirective, FsMapMarkerDirective } from './directives';


@NgModule({ declarations: [
        FsMapComponent,
        FsMapMarkerDirective,
        FsMapLinkDirective,
    ],
    exports: [
        FsMapComponent,
        FsMapMarkerDirective,
        FsMapLinkDirective,
    ], imports: [CommonModule], providers: [provideHttpClient(withJsonpSupport())] })
export class FsMapModule {
}
