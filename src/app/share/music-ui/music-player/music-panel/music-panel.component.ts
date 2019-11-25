import {Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren} from '@angular/core';
import {Song} from '../../../../services/data-types/common.types';
import {MusicScrollComponent} from '../music-scroll/music-scroll.component';
import {findIndex} from '../../../../utils/array';
import {timer} from 'rxjs';
import {SongService} from '../../../../services/song.service';
import {BaseLyricLine, MusicLyric} from './music-lyric';

@Component({
  selector: 'app-music-panel',
  templateUrl: './music-panel.component.html',
  styleUrls: ['./music-panel.component.less']
})
export class MusicPanelComponent implements OnInit, OnChanges {
  @Input() playing: boolean;
  @Input() songList: Song[];
  @Input() currentSong: Song;
  @Input() currentIndex: number;
  @Input() show: boolean;
  @Output() onClose = new EventEmitter<void>();
  @Output() onChangeSong = new EventEmitter<Song>();
  @ViewChildren(MusicScrollComponent) private musicScroll: QueryList<MusicScrollComponent>;

  scrollY = 0;
  currentLyric: BaseLyricLine[];
  private lyric: MusicLyric;
  private lyricRefs: NodeList;
  currentLineNum: number;

  constructor(private songServe: SongService) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.playing) {
      console.log(this.playing, changes.playing.firstChange);
      if (!changes.playing.firstChange) {
        this.lyric && this.lyric.togglePlay(this.playing);
      }
    }
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
        this.resetLyric();
      }
    }
    if (changes.show) {
      if (!changes.show.firstChange && this.show) {
        console.log('musicScroll', this.musicScroll);
        this.musicScroll.first.refreshScroll();
        this.musicScroll.last.refreshScroll();
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
    this.resetLyric();
    this.songServe.getSongLyric(this.currentSong.id ).subscribe(res => {
      this.lyric = new MusicLyric(res);
      this.currentLyric = this.lyric.lines;
      const startLine = res.tlyric ? 1 : 3;
      this.handleLyric(startLine);
      console.log('currentLyric', this.currentLyric);
      this.musicScroll.last.scrollTo(0, 0);
      if (this.playing) {
        this.lyric.play();
      }
    });
  }
  // 重置歌词lyric对象
  private resetLyric() {
    if (this.lyric) {
      this.lyric.stop();
      this.lyric = null;
      this.currentLyric = [];
      this.currentLineNum = 0;
      this.lyricRefs = null;
    }
  }

  private handleLyric(startLine = 3) {
    this.lyric.handler.subscribe(({lineNum}) => {
      console.log('lineNum', lineNum);
      if (!this.lyricRefs) {
        this.lyricRefs = this.musicScroll.last.el.nativeElement.querySelectorAll('ul li');
      }
      if (this.lyricRefs.length) {
        this.currentLineNum = lineNum;
        if (lineNum > startLine) {
          const targetLine = this.lyricRefs[lineNum - startLine];
          if (targetLine) {
            this.musicScroll.last.scrollToElement(targetLine, 500, false, false);
          }
        } else {
          this.musicScroll.last.scrollTo(0, 0);
        }
      }
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
