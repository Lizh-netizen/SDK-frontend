import { WebSee, Window } from '@webmon/types/src/core/base';
import { UAParser } from 'ua-parser-js';
import { variableTypeDetection } from './verifyTypes';
// 获取全局变量
export function getGlobal(): Window {
  return window as unknown as Window;
}
const _global = getGlobal();
const _support = getGlobalSupport();
export const isBrowserEnv = variableTypeDetection.isWindow(typeof window !== 'undefined' ? window : 0);
export function setFlag(replaceType: string, isSet: boolean) {
  if (replaceFlag[replaceType]) return;
  replaceFlag[replaceType] = isSet;
}
export function getFlag(replaceType: string) {
  return replaceFlag[replaceType] ? true : false;
}
export function getGlobalSupport() {
  _global.__webSee__ = _global.__webSee__ || ({} as WebSee);
  return _global.__webSee__;
}
const uaResult = new UAParser().getResult();
// 获取设备信息
_support.deviceInfo = {
  browserVersion: uaResult.browser.version, // // 浏览器版本号 107.0.0.0
  browser: uaResult.browser.name, // 浏览器类型 Chrome
  osVersion: uaResult.os.version, // 操作系统 电脑系统 10
  os: uaResult.os.name, // Windows
  ua: uaResult.ua,
  device: uaResult.device.model ? uaResult.device.model : 'Unknow',
  device_type: uaResult.device.type ? uaResult.device.type : 'Pc',
};

_support.hasError = false;
_support.replaceFlag = _support.replaceFlag || {};
const replaceFlag = _support.replaceFlag;

// errorMap 存储代码错误的集合
_support.errorMap = new Map();
export { _global, _support };
