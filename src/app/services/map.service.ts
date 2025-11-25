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

  constructor() {
    (window as any).fsMapGmNoop = this.fsMapGmNoop.bind(this);
  }

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

      const url = `https://maps.googleapis.com/maps/api/js?loading=async&libraries=places,marker,geometry&key=${this._googleMapKey}&callback=fsMapGmNoop`;

      loadJs(url)
        .pipe(
          delay(0),
        )
        .subscribe();
    }

    return this._loaded$.asObservable();
  }

  public fsMapGmNoop(): void {
    this._loaded = true;
    this._loaded$.next(null);
    this._loaded$.complete();
  }

}
