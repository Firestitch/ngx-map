import { Injectable, inject } from '@angular/core';

import { loadJs } from '@firestitch/common';

import { Observable, Subject, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { FS_MAP_GOOGLE_MAP_KEY } from '../injectors';


@Injectable({
  providedIn: 'root',
})
export class FsMap {

  private _googleMapKey = inject(FS_MAP_GOOGLE_MAP_KEY, { optional: true });
  private _loaded = false;
  private _loaded$: Subject<any>;

  public set googleMapKey(key: string) {
    this._googleMapKey = key;
  }

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
          this._loaded$.next(null);
          this._loaded$.complete();
        });
    }

    return this._loaded$.asObservable();
  }

}
