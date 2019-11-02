import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {fromEvent, merge, Observable, of} from 'rxjs';
import {distinctUntilChanged, filter, map, pluck, takeUntil, tap} from 'rxjs/operators';
import {SliderEventObserverConfig, SlideValue} from '../music-slider-types';
import {DOCUMENT} from '@angular/common';
import {getElementOffset, sliderEvent} from '../music-slider-helper';
import {inArray} from '../../../utils/array';
import {getPercent} from 'ng-zorro-antd';
import {limitNumberInRange} from '../../../utils/number';

@Component({
  selector: 'app-music-slider',
  templateUrl: './music-slider.component.html',
  styleUrls: ['./music-slider.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MusicSliderComponent implements OnInit {
  private sliderDom: HTMLDivElement;
  @Input() musicVertical = false;
  @Input() musicMin = 0;
  @Input() musicMax = 100;
  @ViewChild('musicSlider', {static : true}) private musicSlider: ElementRef;
  private dragStart$: Observable<number>;
  private dragMove$: Observable<number>;
  private dragEnd$: Observable<Event>;
  private isDragging = false;
  value: SlideValue = null;
  offSet: SlideValue = null;

  constructor(@Inject(DOCUMENT) private doc: Document, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.sliderDom = this.musicSlider.nativeElement;
    this.createDraggingObservables();
    this.subscribeDrag(['start']);
  }
  private createDraggingObservables() {
    const orientField = this.musicVertical ? 'pageY' : 'pageX';
    const mouse: SliderEventObserverConfig = {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup',
      filt: (e: MouseEvent) => e instanceof MouseEvent,
      pluckKey: [orientField]
    };
    const touch: SliderEventObserverConfig = {
      start: 'touchdown',
      move: 'touchmove',
      end: 'touchend',
      filt: (e: TouchEvent) => e instanceof TouchEvent,
      pluckKey: ['touches', '0', orientField]
    };
    [mouse, touch].forEach(source => {
      const { start, move, end, filt, pluckKey} = source;
      source.startPlucked$ = fromEvent(this.sliderDom, start).pipe(
        filter(filt), tap(sliderEvent), pluck(...pluckKey),
        map((position: number) => this.findClosestValue(position))
      );
      source.end$ = fromEvent(this.doc, end);
      source.moveResolved$ = fromEvent(this.doc, move).pipe(
        filter(filt), tap(sliderEvent), pluck(...pluckKey),
        distinctUntilChanged(),
        map((position: number) => this.findClosestValue(position)),
        takeUntil(source.end$)
      );
    });
    this.dragStart$ = merge(mouse.startPlucked$, touch.startPlucked$);
    this.dragEnd$ = merge(mouse.end$, touch.end$);
    this.dragMove$ = merge(mouse.moveResolved$, touch.moveResolved$);
  }
  private subscribeDrag(events: string[] = ['start', 'move', 'end']) {
    if (inArray(events, 'start') && this.dragStart$) {
      this.dragStart$.subscribe(this.onDragStart.bind(this));
    }
    if (inArray(events, 'move') && this.dragMove$) {
      this.dragMove$.subscribe(this.onDragMove.bind(this));
    }
    if (inArray(events, 'end') && this.dragEnd$) {
      this.dragEnd$.subscribe(this.onDragEnd.bind(this));
    }
  }
  private onDragStart(value: number) {
    console.log('value', value);
    this.toggleDragMoving(true);
    this.setValue(value);
  }
  private onDragMove(value: number) {
    if (this.isDragging) {
      this.setValue(value);
      this.cdr.markForCheck();
    }
  }
  private onDragEnd() {
    this.toggleDragMoving(false);
    this.cdr.markForCheck();
  }

  private setValue(value: SlideValue) {
    this.value = value;
    this.updateTrackHandle();
  }

  private updateTrackHandle() {
    this.offSet = this.getValueToOffset(this.value);
    this.cdr.markForCheck();
  }

  private getValueToOffset(value: SlideValue): SlideValue {
    return getPercent(this.musicMin, this.musicMax, value);
    // return (value - this.musicMin) / (this.musicMax - this.musicMin) * 100;
  }

  private toggleDragMoving(able: boolean) {
    this.isDragging = able;
    if (able) {
      this.subscribeDrag(['move', 'end']);
    } else {

    }
  }
  private findClosestValue(position: number): number {
    // 获取滑块总长
    const sliderLength = this.getSliderLength();
    // 获取滑块左/上端点位置
    const sliderStart = this.getSliderStartPosition();
    // 滑块当前位置 / 总长
    const ratio = limitNumberInRange((position - sliderStart) / sliderLength, 0, 1);
    const ratioTrue = this.musicVertical ? 1 - ratio : ratio;
    return ratioTrue * (this.musicMax - this.musicMin) + this.musicMin;
  }
  private getSliderLength(): number {
    return this.musicVertical ? this.sliderDom.clientHeight : this.sliderDom.clientWidth;
  }

  private getSliderStartPosition(): number {
    const offset = getElementOffset(this.sliderDom);
    return this.musicVertical ? offset.top : offset.left;
  }
}
