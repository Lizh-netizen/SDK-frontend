import { EVENTTYPES } from '@websee/common';
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
export interface WebSee {
    hasError: false;
    events: string[];
    recordScreenId: string;
    _loopTimer: number;
    transportData: any;
    options: any;
    replaceFlag: {
        [key: string]: any;
    };
    deviceInfo: {
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
    message: string;
    name: string;
}
/**
 * http请求
 */
export interface HttpData {
    type?: string;
    method?: string;
    time: number;
    url: string;
    elapsedTime: number;
    message: string;
    Status?: number;
    status?: string;
    requestData?: {
        httpType: string;
        method: string;
        data: any;
    };
    response?: {
        Status: number;
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
    fileName: string;
}
/**
 * 录屏信息
 */
export interface RecordScreen {
    recordScreenId: string;
    events: string;
}
/**
 * 上报的数据接口
 */
export interface ReportData extends HttpData, ResouceError, CodeError, RecordScreen {
    type: string;
    pageUrl: string;
    time: number;
    uuid: string;
    apikey: string;
    status: string;
    sdkVersion: string;
    deviceInfo: {
        browserVersion: string | number;
        browser: string;
        osVersion: string | number;
        os: string;
        ua: string;
        device: string;
        device_type: string;
    };
}
export interface SdkBase {
    transportData: any;
    options: any;
    notify: any;
}
export type ReplaceCallback = (data: any) => void;
export declare abstract class BasePlugin {
    type: string;
    constructor(type: string);
    abstract bindOptions(options: object): void;
    abstract core(sdkBase: SdkBase): void;
    abstract transform(data: any): void;
}
export declare enum HTTPTYPE {
    XHR = "xhr",
    FETCH = "fetch"
}
export declare enum EMethods {
    Get = "GET",
    Post = "POST",
    Put = "PUT",
    Delete = "DELETE"
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
    url: string;
    elapsedTime: number;
    message: string;
    Status?: number;
    status?: string;
    requestData?: {
        httpType: string;
        method: string;
        data: any;
    };
    response?: {
        Status: number;
        data?: any;
    };
}
