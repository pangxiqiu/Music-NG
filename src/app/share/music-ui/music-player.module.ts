import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MusicPlayerComponent} from './music-player/music-player.component';
import {MusicSliderModule} from './music-slider.module';



@NgModule({
  declarations: [MusicPlayerComponent],
  imports: [
    CommonModule,
    MusicSliderModule
  ],
  exports: [MusicPlayerComponent]
})
export class MusicPlayerModule { }
