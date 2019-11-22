import {Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren} from '@angular/core';
import {Song} from '../../../../services/data-types/common.types';
import {MusicScrollComponent} from '../music-scroll/music-scroll.component';
import {findIndex} from '../../../../utils/array';
import {timer} from 'rxjs';
import {WINDOW} from '../../../../services/services.module';
import {SongService} from '../../../../services/song.service';
import {BaseLyricLine, MusicLyric} from './music-lyric';

@Component({
  selector: 'app-music-panel',
  templateUrl: './music-panel.component.html',
  styleUrls: ['./music-panel.component.less']
})
export class MusicPanelComponent implements OnInit, OnChanges {
  @Input() songList: Song[];
  @Input() currentSong: Song;
  @Input() currentIndex: number;
  @Input() show: boolean;
  @Output() onClose = new EventEmitter<void>();
  @Output() onChangeSong = new EventEmitter<Song>();
  @ViewChildren(MusicScrollComponent) private musicScroll: QueryList<MusicScrollComponent>;

  scrollY = 0;
  currentLyric: BaseLyricLine[];

  constructor(private songServe: SongService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.songList) {
      console.log(this.songList);
      this.currentIndex = 0;
    }
    if (changes.currentSong) {
      if (this.currentSong) {
        this.currentIndex = findIndex(this.songList, this.currentSong);
        this.updateLyric();
        if (this.show) {
          this.scrollToCurrent();
        }
      } else {

      }
    }
    if (changes.show) {
      if (!changes.show.firstChange && this.show) {
        console.log('musicScroll', this.musicScroll);
        this.musicScroll.first.refreshScroll();
        timer(80).subscribe(() => {
          if (this.currentSong) {
            this.scrollToCurrent(0);
          }
        });
        // this.win.setTimeout(() => {
        //   if (this.currentSong) {
        //     this.scrollToCurrent(0);
        //   }
        // }, 80);
      }
    }
  }

  // 获取歌词
  private updateLyric() {
    this.songServe.getSongLyric(this.currentSong.id ).subscribe(res => {
      const lyric = new MusicLyric(res);
      this.currentLyric = lyric.lines;
      console.log('currentLyric', this.currentLyric);
    });
  }

  private scrollToCurrent(speed = 300) {
    const songListRefs = this.musicScroll.first.el.nativeElement.querySelectorAll('ul li');
    if (songListRefs.length) {
      const currentLi = songListRefs[this.currentIndex || 0] as HTMLElement;
      const offsetTop = currentLi.offsetTop;
      const offsetheight = currentLi.offsetHeight;
      // console.log('offsetheight', offsetheight);
      console.log('offsetTop', offsetTop);
      console.log('scrollY', this.scrollY);
      if (((offsetTop - Math.abs(this.scrollY)) > offsetheight * 5) || (offsetTop < Math.abs(this.scrollY))) {
        this.musicScroll.first.scrollToElement(currentLi, speed, false, false);
      }
    }
  }

}
