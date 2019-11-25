import {Lyric} from '../../../../services/data-types/common.types';
import {from, Subject, Subscription, timer, zip} from 'rxjs';
import {skip} from 'rxjs/operators';

// [00:01.000] 正则
const timeExp = /\[(\d{1,2}):(\d{2})(?:\.(\d{2,3}))?\]/;

export interface BaseLyricLine {
  txt: string;
  txtCn: string;
}

interface LyricLine extends BaseLyricLine {
  time: number;
}

interface Handler extends BaseLyricLine {
  lineNum: number;
}

export class MusicLyric {
  private lrc: Lyric;
  lines: LyricLine[] = [];
  // 播放状态
  private playing = false;
  // 播放行数
  private currNum: number;
  // 开始时间
  private startStamp: number;
  private timer: any;
  private pauseStamp: number;
  handler = new Subject<Handler>();
  private timer$: Subscription;
  constructor(lrc: Lyric) {
    this.lrc = lrc;
    this.init();
    console.log('lrc', lrc);
  }

  private init() {
    if (this.lrc.tlyric) {
      // this.generLyric();
      this.generTlyric();
    } else {
      this.generLyric();
    }
  }
  // 获取歌词
  private generLyric() {
    const lines = this.lrc.lyric.split('\n');
    lines.forEach(line => this.makeLine(line));
  }
  // 歌词与翻译
  private generTlyric() {
    const lines = this.lrc.lyric.split('\n');
    const tlines = this.lrc.tlyric.split('\n').filter(item => timeExp.exec(item) !== null);
    const moreLines = lines.length - tlines.length;
    let tempArr = [];
    if (moreLines > 0) {
      tempArr = [lines, tlines];
    } else {
      tempArr = [tlines, lines];
    }
    const first = timeExp.exec(tempArr[1][0])[0];
    const skipIndex = tempArr[0].findIndex(item => {
      const exec = timeExp.exec(item);
      if (exec) {
        return exec[0] === first;
      }
    });

    // tslint:disable-next-line:variable-name
    const _skip = skipIndex === -1 ? 0 : skipIndex;
    const skipItems = tempArr[0].slice(0, _skip);
    if (skipItems.length) {
      skipItems.forEach(line => this.makeLine(line));
    }

    let zipLines$;
    if (moreLines > 0) {
      zipLines$ = zip(from(lines).pipe(skip(_skip)), from(tlines));
    } else {
      zipLines$ = zip(from(lines), from(tlines).pipe(skip(_skip)));
    }
    zipLines$.subscribe(([line, tline]) => this.makeLine(line, tline));
  }

  // 将每一行歌词转换为LyricLine对象存储在lines数组中
  private makeLine(line: string, tline = '') {
    const result = timeExp.exec(line);
    if (result) {
      const txt = line.replace(timeExp, '').trim();
      const txtCn = tline ? tline.replace(timeExp, '').trim() : '';
      if (txt) {
        const millisecond = result[3] || '00';
        const len = millisecond.length;
        // tslint:disable-next-line:variable-name radix
        const _millisecond = len > 2 ? parseInt(millisecond) : parseInt(millisecond) * 10;
        const time = Number(result[1]) * 60 * 1000 + Number(result[2]) * 1000 + _millisecond;
        this.lines.push({ txt, txtCn, time });
      }
    }
  }

  // 播放歌词
  play(startTime = 0) {
    if (!this.lines.length) { return; }
    if (!this.playing) {
      this.playing = !this.playing;
    }
    this.currNum = this.findCurrNum(startTime);
    console.log('curNum', this.currNum);
    this.startStamp = Date.now() - startTime;
    if (this.currNum < this.lines.length) {
      // clearTimeout(this.timer);
      this.clearTimer();
      this.playReset();
    }
  }

  private playReset() {
    let line = this.lines[this.currNum];
    const delay = line.time - (Date.now() - this.startStamp);
    // this.timer = setTimeout(() => {
    //   this.callHandler(this.currNum ++);
    //   if (this.currNum < this.lines.length && this.playing) {
    //     this.playReset();
    //   }
    // }, delay);
    this.timer$ = timer(delay).subscribe(() => {
      this.callHandler(this.currNum++);
      console.log('lineNum', this.currNum);
      if (this.currNum < this.lines.length && this.playing) {
        this.playReset();
      }
    });
  }

  private callHandler(i: number) {
    this.handler.next({
      txt: this.lines[i].txt,
      txtCn: this.lines[i].txtCn,
      lineNum: i
    });
  }

  private clearTimer() {
    this.timer$ && this.timer$.unsubscribe();
  }

  private findCurrNum(time: number): number {
    const index = this.lines.findIndex(item => time <= item.time);
    return index === -1 ? this.lines.length - 1 : index;
  }

  togglePlay(playing: boolean) {
    const now = Date.now();
    this.playing = playing;
    if (playing) {
      const startTime = (this.pauseStamp || now) - (this.startStamp || now);
      this.play(startTime);
    } else {
      this.stop();
      this.pauseStamp = now;
    }
  }
  stop() {
    if (this.playing) {
      this.playing = false;
    }
    this.clearTimer();
  }
}
