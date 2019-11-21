import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import {MusicPlayerComponent} from './music-player/music-player.component';
import {MusicSliderModule} from '../music-slider/music-slider.module';
import {FormsModule} from '@angular/forms';
import {FormatTimePipe} from '../../pipes/format-time.pipe';
import { MusicPanelComponent } from './music-panel/music-panel.component';
import { MusicScrollComponent } from './music-scroll/music-scroll.component';



@NgModule({
  declarations: [
    // MusicPlayerComponent,
    FormatTimePipe,
    MusicPanelComponent,
    MusicScrollComponent],
  imports: [
    CommonModule,
    FormsModule,
    MusicSliderModule
  ],
  exports: [
    // MusicPlayerComponent,
    FormatTimePipe,
    MusicPanelComponent
  ]
})
export class MusicPlayerModule { }
