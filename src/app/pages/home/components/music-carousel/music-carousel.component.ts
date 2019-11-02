import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';


@Component({
  selector: 'app-music-carousel',
  templateUrl: './music-carousel.component.html',
  styleUrls: ['./music-carousel.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MusicCarouselComponent implements OnInit {
  @Input() activeIndex = 0;
  @Output() changeSlide = new EventEmitter< 'pre' | 'next' >();
  @ViewChild('dot', { static: true }) dotRef: TemplateRef<any>;
  constructor() { }

  ngOnInit() {
  }

  onChangeSlide(type: 'pre'|'next') {
    this.changeSlide.emit(type);
  }

}
