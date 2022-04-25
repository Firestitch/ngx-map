import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';

import { ToastrModule } from 'ngx-toastr';

import { FsMapModule } from '@firestitch/package';
import { FsLabelModule } from '@firestitch/label';
import { AppMaterialModule } from './material.module';
import {
  ExampleComponent,
  ExamplesComponent
} from './components';
import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';
import { ConfigureComponent } from './components/configure/configure.componen';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [ AppComponent ],
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
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAoT2RLzCSFUb148F4uLXyAuquAzjcjyGk'
    })
  ],
  entryComponents: [
    ConfigureComponent,
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    ExampleComponent,
    ConfigureComponent,
  ],
  providers: []
})
export class PlaygroundModule {
}
