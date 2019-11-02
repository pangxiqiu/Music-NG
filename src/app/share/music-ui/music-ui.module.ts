import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleSheetComponent } from './single-sheet/single-sheet.component';
import {PlayCountPipe} from '../play-count.pipe';
import { MusicPlayerComponent } from './music-player/music-player.component';
import {MusicSliderModule} from './music-slider.module';



@NgModule({
  declarations: [
    SingleSheetComponent,
    PlayCountPipe,
    MusicPlayerComponent],
  imports: [
    CommonModule,
    MusicSliderModule,
  ],
  exports: [
    SingleSheetComponent,
    PlayCountPipe,
    MusicPlayerComponent]
})
export class MusicUiModule { }
