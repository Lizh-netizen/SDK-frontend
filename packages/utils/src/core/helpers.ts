import { Callback, IAnyObject } from '@webmon/types/src/core/base';
import { _support } from './global';
import { variableTypeDetection } from './verifyTypes';
import { SpanStatus } from '@websee/common';

// 验证选项的类型
export function validateOption(target: any, targetName: string, expectType: string): any {
  if (!target) return false;
  if (typeofAny(target) === expectType) return true;
  console.error(`web-see: ${targetName}期望传入${expectType}类型，目前是${typeofAny(target)}类型`);
}

// 获取当前的时间戳
export function getTimestamp(): number {
  return Date.now();
}

export function typeofAny(target: any): string {
  return Object.prototype.toString.call(target).slice(8, -1).toLowerCase();
}

export function generateUUID(): string {
  let d = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

// 对每一个错误详情，生成唯一的编码
export function getErrorUid(input: string): string {
  return window.btoa(encodeURIComponent(input));
}
export function getLocationHref(): string {
  if (typeof document === 'undefined' || document.location == null) return '';
  return document.location.href;
}

export function hashMapExist(hash: string): boolean {
  const exist = _support.errorMap.has(hash);
  if (!exist) {
    _support.errorMap.set(hash, true);
  }
  return exist;
}

export function interceptStr(str: string, interceptLength: number): string {
  if (variableTypeDetection.isString(str)) {
    return str.slice(0, interceptLength) + (str.length > interceptLength ? `:截取前${interceptLength}个字符` : '');
  }
  return '';
}

/**
 * 原生try函数
 * ../param fn try中执行的函数体
 * ../param errorFn 报错时执行的函数体，将err传入
 */
export function nativeTryCatch(fn: any, errorFn?: any): void {
  try {
    fn();
  } catch (err) {
    if (errorFn) {
      errorFn(err);
    }
  }
}
// window上添加监听事件
export function on(target: any, eventName: string, handler: Callback, opitons = false) {
  target.addEventListener(eventName, handler, opitons);
}

/**
 *
 * 重写对象上面的某个属性
 * ../param source 需要被重写的对象
 * ../param name 需要被重写对象的key
 * ../param replacement 以原有的函数作为参数，执行并重写原有函数
 * ../param isForced 是否强制重写（可能原先没有该属性）
 * ../returns void
 */
export function replaceAop(source: IAnyObject, name: string, replacement: Callback, isForced = false) {
  if (source === undefined) return;
  if (name in source || isForced) {
    // 保留原始函数
    const original = source[name];
    // 将原始函数作为参数传递给回调函数
    const wrapped = replacement(original);
    if (typeof wrapped === 'function') {
      source[name] = wrapped;
    }
  }
}
export function unknownToString(target: unknown): string {
  if (variableTypeDetection.isString(target)) {
    return target as string;
  }
  if (variableTypeDetection.isUndefined(target)) {
    return 'undefined';
  }
  return JSON.stringify(target);
}
export function fromHttpStatus(httpStatus: any) {
  if (httpStatus < 400) {
    return SpanStatus.Ok;
  }
  if (httpStatus >= 400 && httpStatus < 500) {
    switch (httpStatus) {
      case 401:
        return SpanStatus.Unauthenticated;
      case 403:
        return SpanStatus.PermissionDenied;
      case 404:
        return SpanStatus.NotFound;
      case 409:
        return SpanStatus.AlreadyExists;
      case 413:
        return SpanStatus.FailedPrecondition;
      case 429:
        return SpanStatus.ResourceExhausted;
      default:
        return SpanStatus.InvalidArgument;
    }
  }
  if (httpStatus >= 500 && httpStatus < 600) {
    switch (httpStatus) {
      case 501:
        return SpanStatus.Unimplemented;
      case 503:
        return SpanStatus.Unavailable;
      case 504:
        return SpanStatus.DeadlineExceeded;
      default:
        return SpanStatus.InternalError;
    }
  }
  return SpanStatus.UnknownError;
}
