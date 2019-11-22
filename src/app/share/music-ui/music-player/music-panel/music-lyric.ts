import {Lyric} from '../../../../services/data-types/common.types';

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
  constructor(lrc: Lyric) {
    this.lrc = lrc;
    this.init();
    console.log('lrc', lrc);
  }

  private init() {
    if (this.lrc.tlyric) {
      this.generLyric();
      this.generTlyric();
    } else {
      this.generLyric();
    }
  }

  private generLyric() {
    const lyrics = this.lrc.lyric.split('\n');
    lyrics.forEach(line => this.makeLine(line));
  }

  private generTlyric() {

  }
  // 将每一行歌词转换为LyricLine对象存储在lines数组中
  private makeLine(line: string) {
    const result = timeExp.exec(line);
    if (result) {
      const txt = line.replace(timeExp, '').trim();
      const txtCn = '';
      if (txt) {
        const millisecond = result[3] || '00';
        const len = millisecond.length;
        const _millisecond = len > 2 ? parseInt(millisecond) : parseInt(millisecond) * 10;
        const time = Number(result[1]) * 60 * 1000 + Number(result[2]) * 1000 + _millisecond;
        this.lines.push({ txt, txtCn, time });
      }
    }
  }
}
