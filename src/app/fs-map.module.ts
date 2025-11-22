import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { provideHttpClient, withJsonpSupport } from '@angular/common/http';

import { FsMapComponent, FsMapStaticComponent } from './components';
import { FsMapLinkDirective, FsMapMarkerDirective } from './directives';


@NgModule({
  exports: [
    FsMapComponent,
    FsMapMarkerDirective,
    FsMapLinkDirective,
    FsMapStaticComponent,
  ],
  imports: [
    CommonModule,
    FsMapComponent,
    FsMapMarkerDirective,
    FsMapLinkDirective,
    FsMapStaticComponent,
  ],
  providers: [provideHttpClient(withJsonpSupport())] })
export class FsMapModule {
}
