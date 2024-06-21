interface IAnyObject {
    [key: string]: any;
}

interface VueConfiguration {
    silent?: boolean;
    errorHandler?(err: Error, vm: ViewModel, info: string): void;
    warnHandler?(msg: string, vm: ViewModel, trace: string): void;
    keyCodes?: {
        [key: string]: number | Array<number>;
    };
}
interface VueInstance {
    [key: string]: any;
}
interface ViewModel {
    [key: string]: any;
    $root?: Record<string, unknown>;
    $options?: {
        [key: string]: any;
        name?: string;
        propsData?: IAnyObject;
        _componentTag?: string;
        __file?: string;
        props?: IAnyObject;
    };
    $props?: Record<string, unknown>;
}

export { ViewModel, VueConfiguration, VueInstance };
