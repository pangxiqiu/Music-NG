import { NgModule } from '@angular/core';

import { HomeRoutingModule } from './home-routing.module';
import {ShareModule} from '../../share/share.module';
import { HomeComponent } from './home.component';
import { MusicCarouselComponent } from './components/music-carousel/music-carousel.component';
import { MemberCardComponent } from './components/member-card/member-card.component';


@NgModule({
  declarations: [HomeComponent, MusicCarouselComponent, MemberCardComponent],
  imports: [
    HomeRoutingModule,
    ShareModule
  ]
})
export class HomeModule { }
