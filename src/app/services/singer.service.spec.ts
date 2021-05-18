import { SingerService } from "./singer.service"
import { API_CONFIG } from './services.module';
import { defer, Observable, of } from 'rxjs';
import { resolve } from 'url';
import { Singer } from "../types/common.model";
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
        const res: any = {
            artists: [{
                id: 1,
                name: '001',
                picUrl: '001',
                albumSize: 12,
                alias: ['JJ Lin']
            }]
        };
        httpClientSpy.get.and.returnValue(of(res));

        service.getEnterSinger().subscribe(result => {
            expect(result.length).toEqual(1, '数据长度===1');
            expect(result).toBe(res.artists), fail;
        })
        expect(httpClientSpy.get.calls.count()).toBe(1, '被调用1次');
    })
})