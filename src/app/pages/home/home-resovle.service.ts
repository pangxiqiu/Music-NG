import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {HomeService} from '../../services/home.service';
import {SingerService} from '../../services/singer.service';
import {Banner, HotTag, SongSheet, Singer} from '../../services/data-types/common.types';
import {forkJoin, Observable} from 'rxjs';
import {first} from 'rxjs/operators';

type HomeDataType = [Banner[], HotTag[], SongSheet[], Singer[]];

@Injectable()
export class HomeResolverService implements Resolve<HomeDataType> {
  constructor(
    private homeServe: HomeService,
    private singerServe: SingerService,
  ) {}
  resolve(): Observable<HomeDataType> {
    return forkJoin([
      this.homeServe.getBanners(),
      this.homeServe.getHotTags(),
      this.homeServe.getPersonalSheetList(),
      this.singerServe.getEnterSingers()
    ]).pipe(first());
  }
}
