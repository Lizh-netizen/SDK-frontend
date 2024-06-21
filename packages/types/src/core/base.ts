import { BREADCRUMBTYPES, EVENTTYPES, STATUS_CODE } from '@websee/common';

export interface IAnyObject {
  [key: string]: any;
}
export interface Window {
  chrome: {
    app: {
      [key: string]: any;
    };
  };
  history: any;
  addEventListener: any;
  innerWidth: any;
  innerHeight: any;
  onpopstate: any;
  performance: any;
  __webSee__: {
    [key: string]: any;
  };
}
export interface BreadcrumbData {
  type: EVENTTYPES; // 事件类型
  category: BREADCRUMBTYPES; // 用户行为类型
  status: STATUS_CODE; // 行为状态
  time: number; // 发生时间
  data: any;
}
export interface WebSee {
  hasError: false; // 某段时间代码是否报错
  events: string[]; // 存储录屏的信息
  recordScreenId: string; // 本次录屏的id
  _loopTimer: number; // 白屏循环检测的timer
  transportData: any; // 数据上报
  options: any; // 配置信息
  replaceFlag: {
    // 订阅消息
    [key: string]: any;
  };
  deviceInfo: {
    // 设备信息
    [key: string]: any;
  };
}
export type voidFun = (...args: any[]) => void;
export interface ErrorTarget {
  target?: {
    localName?: string;
  };
  error?: any;
  message?: string;
}

export interface ResourceTarget {
  src?: string;
  href?: string;
  localName?: string;
}
/**
 * 资源加载失败
 */
export interface ResouceError {
  time: number;
  message: string; // 加载失败的信息
  name: string; // 脚本类型：js脚本
}
/**
 * http请求
 */
export interface HttpData {
  type?: string;
  method?: string;
  time: number;
  url: string; // 接口地址
  elapsedTime: number; // 接口时长
  message: string; // 接口信息
  Status?: number; // 接口状态编码
  status?: string; // 接口状态
  requestData?: {
    httpType: string; // 请求类型 xhr fetch
    method: string; // 请求方式
    data: any;
  };
  response?: {
    Status: number; // 接口状态
    data?: any;
  };
}
/**
 * 代码错误
 */
export interface CodeError {
  column: number;
  line: number;
  message: string;
  fileName: string; // 发出错误的文件
}
/**
 * 录屏信息
 */
export interface RecordScreen {
  recordScreenId: string; // 录屏id
  events: string; // 录屏内容
}
/**
 * 上报的数据接口
 */
export interface ReportData extends HttpData, ResouceError, CodeError, RecordScreen {
  type: string; // 事件类型
  pageUrl: string; // 页面地址
  time: number; // 发生时间
  uuid: string; // 页面唯一标识
  apikey: string; // 项目id
  status: string; // 事件状态
  // 设备信息
  deviceInfo: {
    browserVersion: string | number; // 版本号
    browser: string; // Chrome
    osVersion: string | number; // 电脑系统 10
    os: string; // 设备系统
    ua: string; // 设备详情
    device: string; // 设备种类描述
    device_type: string; // 设备种类，如pc
  };
}
// sdk插件核心core
export interface SdkBase {
  transportData: any; // 数据上报
  options: any; // 公共配置
  notify: any; // 发布消息
}
export type ReplaceCallback = (data: any) => void;
export abstract class BasePlugin {
  public type: string; // 插件类型
  constructor(type: string) {
    this.type = type;
  }
  abstract bindOptions(options: object): void; // 校验参数
  abstract core(sdkBase: SdkBase): void; // 核心方法
  abstract transform(data: any): void; // 数据转化
}
export enum HTTPTYPE {
  XHR = 'xhr',
  FETCH = 'fetch',
}
export enum EMethods {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
}
export interface ReplaceHandler {
  type: EVENTTYPES;
  callback: Callback;
}
export interface Callback {
  (...args: any[]): any;
}
/**
 * http请求
 */
export interface HttpData {
  type?: string;
  method?: string;
  time: number;
  url: string; // 接口地址
  elapsedTime: number; // 接口时长
  message: string; // 接口信息
  Status?: number; // 接口状态编码
  status?: string; // 接口状态
  requestData?: {
    httpType: string; // 请求类型 xhr fetch
    method: string; // 请求方式
    data: any;
  };
  response?: {
    Status: number; // 接口状态
    data?: any;
  };
}
