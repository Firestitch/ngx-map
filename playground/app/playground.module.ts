import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { FsExampleModule } from '@firestitch/example';
import { FsLabelModule } from '@firestitch/label';
import { FS_MAP_GOOGLE_MAP_KEY, FsMapModule } from '@firestitch/map';
import { FsMessageModule } from '@firestitch/message';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import {
  AddressComponent,
  ExampleComponent,
  ExamplesComponent,
  LinkComponent,
} from './components';
import { ConfigureComponent } from './components/configure/configure.componen';
import { StaticMapComponent } from './components/static-map/static-map.component';
import { AppMaterialModule } from './material.module';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    FsMapModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    FsExampleModule.forRoot(),
    FsMessageModule.forRoot(),
    FsLabelModule,
    ToastrModule.forRoot({ preventDuplicates: true }),
    RouterModule.forRoot(routes, {}),
  ],
  providers: [
    {
      provide: FS_MAP_GOOGLE_MAP_KEY,
      useFactory: () => 'AIzaSyBigr-zo7xG6tqAiAvpqE2Bh4foHVrrSBE',
    },
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    ExampleComponent,
    ConfigureComponent,
    AddressComponent,
    LinkComponent,
    StaticMapComponent,
  ],
})
export class PlaygroundModule {
}
