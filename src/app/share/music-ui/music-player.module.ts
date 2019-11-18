import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MusicPlayerComponent} from './music-player/music-player.component';
import {MusicSliderModule} from './music-slider.module';
import {FormsModule} from '@angular/forms';



@NgModule({
  declarations: [MusicPlayerComponent],
  imports: [
    CommonModule,
    FormsModule,
    MusicSliderModule
  ],
  exports: [MusicPlayerComponent]
})
export class MusicPlayerModule { }
