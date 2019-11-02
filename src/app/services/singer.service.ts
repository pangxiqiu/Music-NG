import {Inject, Injectable} from '@angular/core';
import {API_CONFIG, ServicesModule} from './services.module';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';

import {map} from 'rxjs/operators';
import {Singer} from './data-types/common.types';
import queryString from 'query-string';

type SingerParams = {
  limit: number;
  offset: number;
  cat: string;
};
const defaultParams: SingerParams = {
  limit: 9,
  offset: 0,
  cat: '5001'
}

@Injectable({
  providedIn: ServicesModule
})
export class SingerService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string) { }

  getEnterSingers(args: SingerParams = defaultParams): Observable<Singer[]> {
    const params = new HttpParams({ fromString: queryString.stringify(args) })
    return this.http.get(this.uri + 'artist/list', {params})
      .pipe(map((res: { artists: Singer[] }) => res.artists));
  }
}
