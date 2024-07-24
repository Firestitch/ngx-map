import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HttpClientJsonpModule } from '@angular/common/http';

import { FsMapComponent } from './components';
import { FsMapLinkDirective, FsMapMarkerDirective } from './directives';


@NgModule({
  imports: [
    CommonModule,

    HttpClientJsonpModule,
  ],
  declarations: [
    FsMapComponent,
    FsMapMarkerDirective,
    FsMapLinkDirective,
  ],
  exports: [
    FsMapComponent,
    FsMapMarkerDirective,
    FsMapLinkDirective,
  ],
})
export class FsMapModule {
}
