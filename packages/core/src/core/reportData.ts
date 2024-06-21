import { ReportData } from '@webmon/types/src/core/base';
import { InitOptions } from '@webmon/types/src/core/option';
import { _support, isBrowserEnv } from '@webmon/utils';
import { generateUUID, getLocationHref, validateOption } from '@webmon/utils/src/core/helpers';
import { Queue } from '@webmon/utils/src/core/queue';
import { options } from './options';
export class TransportData {
  queue: Queue = new Queue(); // 消息队列
  apikey = ''; // 每个项目对应的唯一标识
  errorDsn = ''; // 监控上报接口的地址
  userId = ''; // 用户id
  uuid: string; // 每次页面加载的唯一标识
  useImgUpload = false; // 是否使用图片打点上报
  constructor() {
    this.uuid = generateUUID(); // 每次页面加载的唯一标识
  }
  // 判断请求是否为SDK配置的接口
  isSdkTransportUrl(targetUrl: string): boolean {
    let isSdkDsn = false;
    if (this.errorDsn && targetUrl.indexOf(this.errorDsn) !== -1) {
      isSdkDsn = true;
    }
    return isSdkDsn;
  }
  bindOptions(options: InitOptions): void {
    const { dsn, apikey, userId, useImgUpload } = options;
    validateOption(apikey, 'apikey', 'string') && (this.apikey = apikey);
    validateOption(dsn, 'dsn', 'string') && (this.errorDsn = dsn);
    validateOption(userId, 'userId', 'string') && (this.userId = userId || '');
    validateOption(useImgUpload, 'useImgUpload', 'boolean') && (this.useImgUpload = useImgUpload || false);
  }
  imgRequest(data: ReportData, url: string): void {
    const requestFun = () => {
      const img = new Image();
      const spliceStr = url.indexOf('?') === -1 ? '?' : '&';
      img.src = `${url}${spliceStr}data=${encodeURIComponent(JSON.stringify(data))}`;
    };
    this.queue.addFn(requestFun);
  }
  async xhrPost(data: ReportData, url: string): Promise<void> {
    const requestFun = () => {
      fetch(`${url}`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    };
    this.queue.addFn(requestFun);
  }
  beacon(url: string, data: any): boolean {
    return navigator.sendBeacon(url, JSON.stringify(data));
  }
  // 添加用户信息以及别的信息，当前页面的id
  // 这里不要添加时间戳，比如接口报错，发生的时间和上报时间不一致
  getTransportData(data: any): ReportData {
    const info = {
      ...data,
      apikey: this.apikey, // 获取用户信息
      uuid: this.uuid,
      pageUrl: getLocationHref(),
      deviceInfo: _support.deviceInfo, // 获取设备信息
    };

    // 性能数据、录屏、白屏检测等不需要附带用户行为
    // const excludeRreadcrumb = [EVENTTYPES.PERFORMANCE, EVENTTYPES.RECORDSCREEN, EVENTTYPES.WHITESCREEN];
    return info;
  }
  // 上报数据前对数据进行处理，添加公共信息，比如dsn, apikey等等
  async beforePost(this: any, data: ReportData): Promise<ReportData | boolean> {
    let transportData = this.getTransportData(data);
    // 配置了beforeDataReport
    return transportData;
  }
  // 上报数据
  async send(data: ReportData) {
    const dsn = this.errorDsn;
    // 开启录屏，由@websee/recordScreen 插件控制
    if (_support.options.silentRecordScreen) {
      // ['error', 'unhandledrejection', 'resource', 'fetch', 'xhr']
      if (options.recordScreenTypeList.includes(data.type)) {
        // 修改hasError
        _support.hasError = true;
        data.recordScreenId = _support.recordScreenId;
      }
    }

    // 报错之后，这边先上报，用的data.recordScreenId是全局的这个recordScreenId
    const result = (await this.beforePost(data)) as ReportData;
    if (isBrowserEnv && result) {
      // 优先使用sendBeacon 上报，若数据量大，再使用图片打点上报和fetch上报
      const value = this.beacon(dsn, result);
      if (!value) {
        // useImgUpload是配置中设置的
        return this.useImgUpload ? this.imgRequest(result, dsn) : this.xhrPost(result, dsn);
      }
    }
  }
}

const transportData = _support.transportData || (_support.transportData = new TransportData());

export { transportData };
