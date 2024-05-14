import { CommonModule } from '@angular/common';
import { HttpClientJsonpModule } from '@angular/common/http';

import { NgModule } from '@angular/core';
import { FsMapComponent } from './components';
import { FsMapLinkDirective, FsMapMarkerDirective } from './directives';



@NgModule({
  imports: [
    CommonModule,

    //GoogleMapsModule,
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
