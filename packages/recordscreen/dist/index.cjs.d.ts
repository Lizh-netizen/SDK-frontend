interface SdkBase {
    transportData: any;
    options: any;
    notify: any;
}
declare abstract class BasePlugin {
    type: string;
    constructor(type: string);
    abstract bindOptions(options: object): void;
    abstract core(sdkBase: SdkBase): void;
    abstract transform(data: any): void;
}

interface RecordScreenOption {
    recordScreentime: number;
}

declare class RecordScreen extends BasePlugin {
    type: string;
    recordScreentime: number;
    recordScreenTypeList: string[];
    constructor(params?: RecordScreenOption);
    bindOptions(params: RecordScreenOption): void;
    core({ transportData, options }: SdkBase): void;
    transform(): void;
}

export { RecordScreen as default };
