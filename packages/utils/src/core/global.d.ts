import { Window } from '@webmon/types/src/core/base';
export declare function getGlobal(): Window;
declare const _global: Window;
declare const _support: {
    [key: string]: any;
};
export declare const isBrowserEnv: boolean;
export declare function setFlag(replaceType: string, isSet: boolean): void;
export declare function getFlag(replaceType: string): boolean;
export declare function getGlobalSupport(): {
    [key: string]: any;
};
export { _global, _support };
