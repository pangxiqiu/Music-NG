import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.less']
})
export class MusicPlayerComponent implements OnInit {
  sliderValue = 40;
  bufferOffSet = 50;
  constructor() { }

  ngOnInit() {
  }

}
