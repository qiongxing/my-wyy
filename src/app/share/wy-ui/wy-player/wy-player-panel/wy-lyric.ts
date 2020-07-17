import { Lyrics } from 'src/app/types/common.model';

export interface BaseLyricLine {
    txt: string;
    txtCh: string;
}
interface LyricLine extends BaseLyricLine {
    time: number;
}
// [00:13.791]
const timeExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

export class WyLyric {
    private lrc: Lyrics;
    lines: LyricLine[] = [];
    constructor(lrc: Lyrics) {
        console.log(lrc)
        this.lrc = lrc;
        this.init()
    }
    private init() {
        if (this.lrc.tlyric) {
            this.generTLyric()
        } else {
            this.generLyric()
        }
    }
    private generTLyric() {
        throw new Error("Method not implemented.");
    }
    private generLyric() {
        const lines = this.lrc.lyric.split('\n');
        lines.forEach(line => this.markline(line));
        console.log('lines', this.lines)
    }
    private markline(line) {
        const result = timeExp.exec(line);
        // console.log('result', result);
        if (result) {
            const txt = line.replace(timeExp, '');
            const txtCh = '';
            let thirdResult = result[3] || '00';
            const _thirdResult = thirdResult.length > 2 ? parseInt(thirdResult) : parseInt(thirdResult) * 10;
            console.log('_thirdResult', _thirdResult)
            const time = Number(result[1]) * 60 * 1000 + Number(result[2]) * 1000 + _thirdResult;
            this.lines.push({ txt: txt, txtCh: txtCh, time: time });
        }
    }
}
