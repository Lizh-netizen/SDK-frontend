import { Window } from '@webmon/types/src/core/base';

declare function getGlobal(): Window;
declare const _global: Window;
declare const _support: {
    [key: string]: any;
};
declare const isBrowserEnv: boolean;
declare function setFlag(replaceType: string, isSet: boolean): void;
declare function getFlag(replaceType: string): boolean;
declare function getGlobalSupport(): {
    [key: string]: any;
};

export { _global, _support, getFlag, getGlobal, getGlobalSupport, isBrowserEnv, setFlag };
