import { Base64 } from 'js-base64';
import { AnyJson } from '../types/common.model';

export function codeJson(source: Object, type = "encode"): AnyJson {
    let result = {};
    for (const attr in source) {
        if (source.hasOwnProperty(attr)) {
            result[Base64[type](attr)] = Base64[type](source[attr]);
        }
    }
    return result;
}