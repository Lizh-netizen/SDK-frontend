import { voidFun } from '@webmon/types/src/core/base';
export declare class Queue {
    private stack;
    private isFlushing;
    constructor();
    addFn(fn: voidFun): void;
    clear(): void;
    getStack(): any[];
    flushStack(): void;
}
