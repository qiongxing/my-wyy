import { TestBed } from '@angular/core/testing';
import { AnyJson } from '../types/common.model';
import { WINDOW } from './services.module';

import { StorageService } from './storage.service';



fdescribe('StorageService', () => {
  let service: StorageService;
  beforeEach(() => {
    service = new StorageService(window)
  }
  );

  it('should set localStroge', () => {
    let params: AnyJson = { key: "key", value: "value" };
    service.setStorage(params);
    let result = window.localStorage.getItem("key");
    expect("value").toEqual(result);
  })
});
