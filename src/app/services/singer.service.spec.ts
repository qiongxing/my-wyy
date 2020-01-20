import { SingerService } from "./singer.service"
import { API_CONFIG } from './services.module';
import { defer, Observable, of } from 'rxjs';
import { resolve } from 'url';
let httpClientSpy: { get: jasmine.Spy };
let service: SingerService;
fdescribe('Test SingerService', () => {
    let url;
    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
        url = ''
        service = new SingerService(<any>httpClientSpy, url);
    })
    function asyncData<T>(data: T) {
        return defer(() => Promise.resolve(data));
    }
    it('http服务被正常调用', () => {
        const res = [{
            id: '001',
            name: '001',
            picUrl: '001',
            albumSize: '001',
        }];
        httpClientSpy.get.and.returnValue(of(res));

        service.getEnterSinger().subscribe(res => {
            expect(res.length).toEqual(1, '数据长度===1');
            expect(res).toEqual(res), fail;
        })
        expect(httpClientSpy.get.calls.count()).toBe(1, '被调用1次');
    })
})