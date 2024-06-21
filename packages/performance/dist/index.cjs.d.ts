import { BasePlugin, SdkBase } from '@websee/types';

declare class WebPerformance extends BasePlugin {
    type: string;
    constructor();
    bindOptions(): void;
    core({ transportData }: SdkBase): void;
    transform(): void;
}

export { WebPerformance as default };
