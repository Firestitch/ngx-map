import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { provideHttpClient, withJsonpSupport } from '@angular/common/http';

import { FsMapComponent, FsMapStaticComponent } from './components';
import { FsMapLinkDirective, FsMapMarkerDirective } from './directives';


@NgModule({ declarations: [
  FsMapComponent,
  FsMapMarkerDirective,
  FsMapLinkDirective,
  FsMapStaticComponent,
],
exports: [
  FsMapComponent,
  FsMapMarkerDirective,
  FsMapLinkDirective,
  FsMapStaticComponent,
], 
imports: [
  CommonModule,
], 
providers: [provideHttpClient(withJsonpSupport())] })
export class FsMapModule {
}
