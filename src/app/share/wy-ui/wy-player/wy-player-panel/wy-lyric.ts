import { Lyrics } from 'src/app/types/common.model';
import { zip, from, Subject } from 'rxjs';
import { skip } from 'rxjs/internal/operators';

export interface BaseLyricLine {
    txt: string;
    txtCh: string;
}
interface LyricLine extends BaseLyricLine {
    time: number;
}
interface Handler extends BaseLyricLine {
    lineNum: number;
}
// [00:13.791]
const timeExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

export class WyLyric {
    private lrc: Lyrics;
    private playing = false;
    private curNum: number;
    private startStamp: number;
    private pauseStamp: number;
    private timer: any;
    lines: LyricLine[] = [];
    handler = new Subject<Handler>();
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
        const lines = this.lrc.lyric.split('\n').filter(item => timeExp.test(item));
        const tlines = this.lrc.tlyric.split('\n').filter(item => timeExp.test(item));
        console.log('tlines', tlines);
        const moreLength = lines.length - tlines.length;
        let tempArr = [[], []];
        if (moreLength >= 0) {
            tempArr = [lines, tlines];
        } else {
            tempArr = [tlines, lines];
        }
        const first = timeExp.exec(tempArr[1][0])[0];
        const skipIndex = tempArr[0].findIndex(line => timeExp.exec(line)[0] === first);
        const _skip = skipIndex === -1 ? 0 : skipIndex;
        const skipTmp = tempArr[0].slice(0, _skip);
        skipTmp.forEach(tmp => this.markline(tmp));
        let zipLine$;
        if (moreLength >= 0) {
            zipLine$ = zip(from(lines).pipe(skip(_skip)), from(tlines));
        } else {
            zipLine$ = zip(from(lines), from(tlines).pipe(skip(_skip)));
        }
        zipLine$.subscribe(([line, tline]) => {
            this.markline(line, tline);
        })
    }
    private generLyric() {
        const lines = this.lrc.lyric.split('\n');
        lines.forEach(line => this.markline(line));
        console.log('lines', this.lines)
    }
    private markline(line, tline = '') {
        const result = timeExp.exec(line);
        // console.log('result', result);
        if (result) {
            const txt = line.replace(timeExp, '');
            const txtCh = tline ? tline.replace(timeExp, '') : '';
            let thirdResult = result[3] || '00';
            const _thirdResult = thirdResult.length > 2 ? parseInt(thirdResult) : parseInt(thirdResult) * 10;
            // console.log('_thirdResult', _thirdResult)
            const time = Number(result[1]) * 60 * 1000 + Number(result[2]) * 1000 + _thirdResult;
            this.lines.push({ txt: txt, txtCh: txtCh, time: time });
        }
    }

    play(startTime = 0) {
        if (!this.lines.length) return;
        if (!this.playing) {
            this.playing = true;
        }
        this.curNum = this.findCurNum(startTime);
        /**当前播放时间 */
        this.startStamp = Date.now() - startTime;
        if (this.curNum < this.lines.length) {
            clearTimeout(this.timer);
            this.playReset();
        }
    }
    private playReset() {
        const line = this.lines[this.curNum];
        //歌词时间-经过时间=延迟
        const delay = line.time - (Date.now() - this.startStamp);
        this.timer = setTimeout(() => {
            this.callHandler(this.curNum++);
            console.log(this.curNum)
            if (this.playing && this.curNum < this.lines.length - 1) {
                this.playReset();
            }
        }, delay)
    }
    private callHandler(i: number) {
        this.handler.next({
            txt: this.lines[i].txt,
            txtCh: this.lines[i].txtCh,
            lineNum: i
        })
    }
    private findCurNum(time): number {
        const index = this.lines.findIndex(line => line.time >= time);
        return index !== -1 ? index : this.lines.length - 1;
    }
    togglePlay(playing) {
        const now = Date.now();
        this.playing = playing;
        if (this.playing) {
            const startTime = (this.pauseStamp || now) - (this.startStamp || now);
            this.play(startTime);
        } else {
            this.stop();
            this.pauseStamp = now;
        }
    }
    private stop() {
        this.playing = false;
        clearTimeout(this.timer);
    }
}
