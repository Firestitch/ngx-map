import { Inject, Injectable } from '@angular/core';

import { loadJs } from '@firestitch/common';

import { Observable, of, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';

import { FS_MAP_GOOGLE_MAP_KEY } from '../injectors';


@Injectable({
  providedIn: 'root',
})
export class FsMap {

  private _loaded = false;
  private _loaded$: Subject<any>;

  constructor(
    @Inject(FS_MAP_GOOGLE_MAP_KEY) private _googleMapKey: string,
  ) { }

  public get loaded$(): Observable<any> {
    if (this._loaded) {
      return of(this._loaded);
    }

    if(this._loaded$) {
      return this._loaded$;
    }

    if (!this._loaded$) {      
      this._loaded$ = new Subject();

      loadJs(`https://maps.googleapis.com/maps/api/js?libraries=places,marker&key=${this._googleMapKey}`)
        .pipe(
          delay(0),
        )
        .subscribe(() => {
          this._loaded = true;
          this._loaded$.next();
          this._loaded$.complete();
        });
    }

    return this._loaded$.asObservable();
  }

}
