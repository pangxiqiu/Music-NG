import {Component, OnInit, ViewChild} from '@angular/core';
import {Banner, HotTag, Singer, SongSheet} from '../../services/data-types/common.types';
import {NzCarouselComponent} from 'ng-zorro-antd';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';
import {SheetService} from '../../services/sheet.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  carouselActiveIndex = 0;
  banners: Banner[];
  tags: HotTag[];
  sheets: SongSheet[];
  artists: Singer[];
  @ViewChild(NzCarouselComponent, { static: true }) private nzCarousel: NzCarouselComponent;

  constructor(
    private route: ActivatedRoute,
    private sheetSever: SheetService
  ) {
    this.route.data.pipe(map(res => res.homeDatas)).subscribe(([banners, tags, sheets, artists]) => {
      this.banners = banners;
      this.tags = tags;
      this.sheets = sheets;
      this.artists = artists;
    });
  }
  ngOnInit() {}
  onBeforeChange({ to }) {
    this.carouselActiveIndex = to;
  }

  onChangeSlide(type: 'pre'|'next') {
    this.nzCarousel[type]();
  }

  onPlaySheet(id: number) {
    console.log('id', id);
    this.sheetSever.playSheet(id).subscribe(res => {
      console.log('res', res);
    });
  }
}
