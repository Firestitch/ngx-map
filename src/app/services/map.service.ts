import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable, of, Subject } from 'rxjs';

import { FS_MAP_GOOGLE_MAP_KEY } from '../injectors';


@Injectable()
export class FsMap {

  private _loaded = false;
  private _loaded$: Subject<any>;

  public constructor(
    @Inject(FS_MAP_GOOGLE_MAP_KEY) private _googleMapKey: string,
    private _httpClient: HttpClient,
  ) { }

  public get loaded$(): Observable<any> {
    if (this._loaded) {
      return of(this._loaded);
    }

    if (!this._loaded$) {
      this._loaded$ = new Subject();
      this._httpClient
        .jsonp(`https://maps.googleapis.com/maps/api/js?libraries=places&key=${this._googleMapKey}`, 'callback')
        .subscribe(() => {
          this._loaded = true;
          this._loaded$.next();
          this._loaded$.complete();
        });
    }

    return this._loaded$.asObservable();
  }

}
