import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgZorroAntdModule} from 'ng-zorro-antd';
import {FormsModule} from '@angular/forms';
import {MusicUiModule} from './music-ui/music-ui.module';



@NgModule({
  imports: [
    NgZorroAntdModule,
    FormsModule,
    CommonModule,
    MusicUiModule
  ],
  exports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    MusicUiModule,
  ]
})
export class ShareModule { }
