import { Callback, IAnyObject } from '@webmon/types/src/core/base';
import { SpanStatus } from '@websee/common';
export declare function validateOption(target: any, targetName: string, expectType: string): any;
export declare function getTimestamp(): number;
export declare function typeofAny(target: any): string;
export declare function generateUUID(): string;
export declare function getErrorUid(input: string): string;
export declare function getLocationHref(): string;
export declare function hashMapExist(hash: string): boolean;
export declare function interceptStr(str: string, interceptLength: number): string;
/**
 * 原生try函数
 * ../param fn try中执行的函数体
 * ../param errorFn 报错时执行的函数体，将err传入
 */
export declare function nativeTryCatch(fn: any, errorFn?: any): void;
export declare function on(target: any, eventName: string, handler: Callback, opitons?: boolean): void;
/**
 *
 * 重写对象上面的某个属性
 * ../param source 需要被重写的对象
 * ../param name 需要被重写对象的key
 * ../param replacement 以原有的函数作为参数，执行并重写原有函数
 * ../param isForced 是否强制重写（可能原先没有该属性）
 * ../returns void
 */
export declare function replaceAop(source: IAnyObject, name: string, replacement: Callback, isForced?: boolean): void;
export declare function unknownToString(target: unknown): string;
export declare function fromHttpStatus(httpStatus: any): SpanStatus.Ok | SpanStatus.DeadlineExceeded | SpanStatus.Unauthenticated | SpanStatus.PermissionDenied | SpanStatus.NotFound | SpanStatus.ResourceExhausted | SpanStatus.InvalidArgument | SpanStatus.Unimplemented | SpanStatus.Unavailable | SpanStatus.InternalError | SpanStatus.UnknownError | SpanStatus.AlreadyExists | SpanStatus.FailedPrecondition;
