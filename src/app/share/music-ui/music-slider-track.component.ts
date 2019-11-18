import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MusicSliderStyle} from './music-slider-types';

@Component({
  selector: 'app-music-slider-track',
  template: `<div class="wy-slider-track" [class.buffer]="musicBuffer" [ngStyle]="style"></div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MusicSliderTrackComponent implements OnInit, OnChanges {
  @Input() musicVertical = false;
  @Input() musicLength: number;
  @Input() musicBuffer = false;
  style: MusicSliderStyle = {};
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['musicLength']) {
      if (this.musicVertical) {
        this.style.height = this.musicLength + '%';
        this.style.left = null;
        this.style.width = null;
      } else {
        this.style.width = this.musicLength + '%';
        this.style.bottom = null;
        this.style.height = null;
      }
    }
  }

}
