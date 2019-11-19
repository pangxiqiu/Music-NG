import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {IndexStoreModule} from '../../../store/index.store.module';
import {getCurrentIndex, getCurrentSong, getPlayList, getPlayMode, getSongList} from '../../../store/selectors/player.select';
import {Song} from '../../../services/data-types/common.types';
import {PlayMode} from './player-types';
import {SetCurrentIndex} from '../../../store/actions/player.action';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.less']
})
export class MusicPlayerComponent implements OnInit {
  percent = 0;
  bufferOffSet = 0;

  SongList: Song[];
  PlayList: Song[];
  // 当前播放歌曲索引
  currentIndex: number;
  // 当前播放歌曲
  currentSong: Song;
  // 当前播放歌曲时长
  duration: number;
  // 当前播放歌曲实时计数
  currentTime: number;
  // 播放状态
  playing: false;
  // 是否可以播放
  songReady: false;
  // 音量
  volume = 30;
  // 是否显示音量面板
  showVolume = false;

  @ViewChild('audioElement', {static: true}) private audioElement: ElementRef;
  private audioEl: HTMLAudioElement;

  constructor(
    private store$: Store<IndexStoreModule>
  ) {
    const IndexStore$ = this.store$.pipe(select( 'player' ));
    const stateArr = [
      {
        type: getSongList,
        cb: list => this.watchList(list, 'SongList')
      }, {
        type: getPlayList,
        cb: list => this.watchList(list, 'PlayList')
      }, {
        type: getCurrentIndex,
        cb: list => this.watchCurrentIndex(list)
      }, {
        type: getPlayMode,
        cb: mode => this.watchPlayMode(mode)
      }, {
        type: getCurrentSong,
        cb: list => this.watchCurrentSong(list)
      }
    ];
      stateArr.forEach(item => {
        IndexStore$.pipe(select( item.type )).subscribe(item.cb);
      });


  }
  ngOnInit() {
    this.audioEl = this.audioElement.nativeElement;
    // console.log(this.audioElement.nativeElement);
  }
  private watchList(list: Song[], type: string) {
    this[type] = list;
  }
  private watchCurrentIndex(index: number) {
    this.currentIndex = index;
  }
  private watchPlayMode(mode: PlayMode) {
    console.log('mode', mode);
  }
  private watchCurrentSong(song: Song) {
    if (song) {
      this.duration = song.dt / 1000;
      this.currentSong = song;
      console.log('song', song);
    }
  }
  onTimeUpdate(e: Event) {
    this.currentTime = ( e.target as HTMLAudioElement).currentTime;
    this.percent = (this.currentTime / this.duration) * 100;
    const buffered = this.audioEl.buffered;
    if (buffered.length && this.bufferOffSet < 100) {
      this.bufferOffSet = (buffered.end(0) / this.duration ) * 100;
    }
  }

  onCanPlay() {
    this.songReady = true;
    this.play();
  }
  private play() {
    this.audioEl.play();
    this.playing = true;
  }
  // 音量
  onVolumeChange(per: number) {
    this.audioEl.volume = per / 100;
  }

  // 控制显示音量面板
  toggleVolume(evt: MouseEvent) {
    evt.stopPropagation();
    this.showVolume = !this.showVolume;
  }

  // 播放/暂停
  onToggle() {
    if (this.currentSong) {
      if (this.songReady) {
        this.playing = !this.playing;
        if (this.playing) {
          this.audioEl.play();
        } else {
          this.audioEl.pause();
        }
      }
    } else {
      if (this.PlayList.length) {
        this.store$.dispatch(SetCurrentIndex({ currentIndex: 0}));
        this.songReady = false;
      }
    }
  }
  // 上一曲
  onPrev(index: number) {
    if (!this.songReady) { return; }
    if (this.PlayList.length === 1) {
      this.loop();
    } else {
      const newIndex = index < 0 ? this.PlayList.length - 1 : index;
      this.updateIndex(newIndex);
    }
  }

  // 下一曲
  onNext(index: number) {
    if (!this.songReady) { return; }
    if (this.PlayList.length === 1) {
      this.loop();
    } else {
      const newIndex = index >= this.PlayList.length ? 0 : index;
      this.updateIndex(newIndex);
    }
  }

  get PicUrl(): string {
    return this.currentSong ? this.currentSong.al.picUrl : '//s4.music.126.net/style/web2/img/default/default_album.jpg';
  }
  // 单曲循环
  private loop() {
    this.audioEl.currentTime = 0;
    this.play();
  }

  // 更新播放歌曲索引
  private updateIndex(index: number) {
    this.store$.dispatch(SetCurrentIndex({ currentIndex: index}));
    this.songReady = false;
  }

  onPersentChange(pre: number) {
    // console.log('pre', pre);
    if (this.currentTime) {
      this.audioEl.currentTime = this.duration * (pre / 100);
    }

  }
}
