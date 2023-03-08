import { CommonModule } from '@angular/common';
import { HttpClientJsonpModule } from '@angular/common/http';

import { NgModule, ModuleWithProviders } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { FsMapComponent } from './components';
import { FsMapMarkerDirective } from './directives';
import { FS_MAP_GOOGLE_MAP_KEY } from './injectors';


@NgModule({
  imports: [
    CommonModule,

    GoogleMapsModule,
    HttpClientJsonpModule,
  ],
  declarations: [
    FsMapComponent,
    FsMapMarkerDirective,
  ],
  exports: [
    FsMapComponent,
    FsMapMarkerDirective,
  ],
})
export class FsMapModule {
  static forRoot(config: { googleMapKey: string }): ModuleWithProviders<FsMapModule> {
    return {
      ngModule: FsMapModule,
      providers: [
        { provide: FS_MAP_GOOGLE_MAP_KEY, useValue: config.googleMapKey }
      ]
    };
  }
}
