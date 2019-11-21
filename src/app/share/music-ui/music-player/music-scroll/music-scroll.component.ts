import {
  Component,
  OnInit,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Input,
  OnChanges, SimpleChanges
} from '@angular/core';
import BScroll from 'better-scroll';
import ScrollBar from '@better-scroll/scroll-bar';
import {timer} from 'rxjs';

// BScroll.use(ScrollBar);

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
  @ViewChild('wrap', { static: true }) private wrapRef: ElementRef;
  private bs: BScroll;
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data) {
    this.refreshScroll();
    }
  }

  ngAfterViewInit() {
    this.bs = new BScroll(this.wrapRef.nativeElement
    //   , {
    //   scrollbar: {
    //     interactive: true
    //   }
    // }
    );
  }

  private refresh() {
    console.log('refresh');
    this.bs.refresh();
  }

  refreshScroll() {
    timer(this.refreshDelay).subscribe(() => {
      this.refresh();
    });
  }

}
