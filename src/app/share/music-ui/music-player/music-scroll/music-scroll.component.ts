import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  OnChanges, SimpleChanges, Output, EventEmitter
} from '@angular/core';
import ScrollBar from '@better-scroll/scroll-bar';
import {timer} from 'rxjs';
import BScroll from '@better-scroll/core';

BScroll.use(ScrollBar);

@Component({
  selector: 'app-music-scroll',
  template: `
    <div class="wy-scroll" #wrap>
      <ng-content></ng-content>
    </div>
  `,
  styles: [`.wy-scroll{width: 100%; height: 100%; overflow: hidden;}`],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MusicScrollComponent implements OnInit , AfterViewInit, OnChanges {
  @Input() data: any[];
  @Input() refreshDelay = 50;
  @Output() private onScrollEnd = new EventEmitter<number>();
  @ViewChild('wrap', { static: true }) private wrapRef: ElementRef;
  private bs: BScroll;
  constructor(readonly el: ElementRef) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
    this.refreshScroll();
    }
  }

  ngAfterViewInit() {
    this.bs = new BScroll(this.wrapRef.nativeElement, {
      scrollbar: {
        interactive: true,
        fade: true
      }
    });
    this.bs.on('scrollEnd', ({ y }) => this.onScrollEnd.emit(y));
  }

  scrollToElement(...args) {
    this.bs.scrollToElement.apply(this.bs, args);
  }
  scrollTo(...args) {
    this.bs.scrollTo.apply(this.bs, args);
  }

  private refresh() {
    console.log('refresh');
    this.bs.refresh();
  }
  // 刷新滚动区
  refreshScroll() {
    timer(this.refreshDelay).subscribe(() => {
      this.refresh();
    });
  }

}
