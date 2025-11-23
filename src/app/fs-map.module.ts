import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { provideHttpClient, withJsonpSupport } from '@angular/common/http';

import { FsMapComponent, FsMapStaticComponent } from './components';
import { FsMapLinkDirective, FsMapMarkerDirective, FsMapPolylineDirective, FsMapPolylineMarkerDirective } from './directives';


@NgModule({
  exports: [
    FsMapComponent,
    FsMapMarkerDirective,
    FsMapLinkDirective,
    FsMapStaticComponent,
    FsMapPolylineDirective,
    FsMapPolylineMarkerDirective,
  ],
  imports: [
    CommonModule,
    FsMapComponent,
    FsMapMarkerDirective,
    FsMapLinkDirective,
    FsMapStaticComponent,
    FsMapPolylineDirective,
    FsMapPolylineMarkerDirective,
  ],
  providers: [provideHttpClient(withJsonpSupport())] })
export class FsMapModule {
}
