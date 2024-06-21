export interface InitOptions {
    dsn: string;
    apikey: string;
    userId?: string;
    disabled?: boolean;
    silentXhr?: boolean;
    silentFetch?: boolean;
    silentClick?: boolean;
    silentError?: boolean;
    silentUnhandledrejection?: boolean;
    silentHashchange?: boolean;
    silentHistory?: boolean;
    silentPerformance?: boolean;
    silentRecordScreen?: boolean;
    recordScreentime?: number;
    recordScreenTypeList?: string[];
    silentWhiteScreen?: boolean;
    skeletonProject?: boolean;
    whiteBoxElements?: string[];
    filterXhrUrlRegExp?: RegExp;
    useImgUpload?: boolean;
    throttleDelayTime?: number;
    overTime?: number;
    maxBreadcrumbs?: number;
    getUserId?: () => string | number;
    handleHttpStatus?: (data: any) => boolean;
    repeatCodeError?: boolean;
}
export interface RecordScreenOption {
    recordScreentime: number;
}
