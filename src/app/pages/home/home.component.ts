import {Component, OnInit, ViewChild} from '@angular/core';
import {Banner, HotTag, Singer, SongSheet} from '../../services/data-types/common.types';
import {NzCarouselComponent} from 'ng-zorro-antd';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';
import {SheetService} from '../../services/sheet.service';
import {IndexStoreModule} from '../../store/index.store.module';
import {select, Store} from '@ngrx/store';
import {SetCurrentIndex, SetPlayList, SetSongList} from '../../store/actions/player.action';
import {PlayState} from 'src/app/store/reducers/player.reducer';
import {findIndex, shuffle} from '../../utils/array';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  // 初始化参数：轮播图、选项卡分类、歌单、歌手
  carouselActiveIndex = 0;
  banners: Banner[];
  tags: HotTag[];
  sheets: SongSheet[];
  artists: Singer[];
  private playState: PlayState;
  @ViewChild(NzCarouselComponent, { static: true }) private nzCarousel: NzCarouselComponent;

  constructor(
    private route: ActivatedRoute,
    private sheetSever: SheetService,
    private store$: Store<IndexStoreModule>
  ) {
    this.route.data.pipe(map(res => res.homeDatas)).subscribe(([banners, tags, sheets, artists]) => {
      this.banners = banners;
      this.tags = tags;
      this.sheets = sheets;
      this.artists = artists;
    });
    this.store$.pipe(select('player')).subscribe(res => this.playState = res);
  }
  ngOnInit() {}
  onBeforeChange({ to }) {
    this.carouselActiveIndex = to;
  }

  onChangeSlide(type: 'pre'|'next') {
    this.nzCarousel[type]();
  }

  onPlaySheet(id: number) {
    // console.log('id', id);

    this.sheetSever.playSheet(id).subscribe(list => {
      this.store$.dispatch(SetSongList({ songList: list}));
      let trueIndex = 0;
      let trueList = list.slice();
      if (this.playState.playMode.type === 'random') {
        trueList = shuffle(list || []);
        trueIndex = findIndex(trueList, list[trueIndex]);
      }
      this.store$.dispatch(SetPlayList({ playList: trueList}));
      this.store$.dispatch(SetCurrentIndex({ currentIndex: trueIndex}));
    });
  }
}
