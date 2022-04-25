import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { FsComponentComponent } from './components/component';
// import { FsComponentService } from './services';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
  ],
  entryComponents: [
  ],
  declarations: [
  ],
  providers: [
  ],
})
export class FsMapModule {
  static forRoot(): ModuleWithProviders<FsMapModule> {
    return {
      ngModule: FsMapModule,
      // proviyders: [FsComponentService]
    };
  }
}
