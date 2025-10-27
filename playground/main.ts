import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { FS_MAP_GOOGLE_MAP_KEY, FsMapModule } from '@firestitch/map';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';
import { FsLabelModule } from '@firestitch/label';
import { ToastrModule } from 'ngx-toastr';
import { provideRouter, Routes } from '@angular/router';
import { ExamplesComponent } from './app/components';
import { AppComponent } from './app/app.component';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
];



if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FsMapModule, FormsModule, FsExampleModule.forRoot(), FsMessageModule.forRoot(), FsLabelModule, ToastrModule.forRoot({ preventDuplicates: true })),
        {
            provide: FS_MAP_GOOGLE_MAP_KEY,
            useFactory: () => 'AIzaSyBigr-zo7xG6tqAiAvpqE2Bh4foHVrrSBE',
        },
        provideAnimations(),
        provideRouter(routes),
    ]
})
  .catch(err => console.error(err));

