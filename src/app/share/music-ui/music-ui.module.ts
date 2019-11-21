import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleSheetComponent } from './single-sheet/single-sheet.component';
import {PlayCountPipe} from '../pipes/play-count.pipe';
import { MusicPlayerComponent } from './music-player/music-player.component';
import {MusicSliderModule} from './music-slider/music-slider.module';
import {FormsModule} from '@angular/forms';
import {MusicPlayerModule} from './music-player/music-player.module';



@NgModule({
  declarations: [
    SingleSheetComponent,
    PlayCountPipe,
    MusicPlayerComponent
  ],
  imports: [
    CommonModule,
    MusicSliderModule,
    FormsModule,
    MusicPlayerModule,
  ],
  exports: [
    SingleSheetComponent,
    PlayCountPipe,
    MusicPlayerComponent
  ]
})
export class MusicUiModule { }
