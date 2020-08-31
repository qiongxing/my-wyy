export function isEmptyObject(obj: Object) {
    return JSON.stringify(obj) === '{}'
}