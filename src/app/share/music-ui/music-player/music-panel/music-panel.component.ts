import {Component, EventEmitter, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren} from '@angular/core';
import {Song} from '../../../../services/data-types/common.types';
import {MusicScrollComponent} from '../music-scroll/music-scroll.component';

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
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.songList) {
      console.log(this.songList);
    }
    if (changes.currentSong) {
      console.log(this.currentSong);
    }
    if (changes.show) {
      if (!changes.show.firstChange && this.show) {
        console.log('musicScroll', this.musicScroll);
        this.musicScroll.first.refreshScroll();
      }
    }
  }

}
