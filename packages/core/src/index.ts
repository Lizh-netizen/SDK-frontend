import { ViewModel, VueInstance } from '@webmon/types';
import { InitOptions } from '@webmon/types/src/core/option';
import { _global } from '@webmon/utils';
import { handleOptions, options } from './core/options';
import { HandleEvents, transportData } from './core';
import { getTimestamp, nativeTryCatch } from '@webmon/utils/src/core/helpers';
import { EVENTTYPES, STATUS_CODE } from '@webmon/common/src';
import { setupReplace } from './core/setupReplace';

// 作为插件的形式插入到Vue中，当使用Vue.use(Websee)时，就会调用Websee的这个方法
function install(Vue: VueInstance, options: InitOptions) {
  const handler = Vue.config.errorHandler;
  // vue项目在Vue.config.errorHandler中上报错误, 在初始化的时候去注册事件
  Vue.config.errorHandler = function (err: Error, vm: ViewModel, info: string): void {
    console.log(err);
    HandleEvents.handleError(err);
    if (handler) handler.apply(null, [err, vm, info]);
  };
  init(options);
}
// 初始化配置
function init(options: InitOptions) {
  if (!options.dsn || !options.apikey) {
    return console.error(`web-mon 缺少必须配置项：${!options.dsn ? 'dsn' : 'apikey'} `);
  }
  if (!('fetch' in _global) || options.disabled) return;
  // 初始化配置
  handleOptions(options);
  // 初始化事件的拦截
  setupReplace();
}
// 插件
function use(plugin: any, option: any) {
  const instance = new plugin(option);
  nativeTryCatch(() => {
    instance.core({ transportData, options });
  });
}

function captureError({ message, lineNumber, columnNumber }: { message: string; lineNumber: number; columnNumber: number }) {
  const errorData = {
    type: EVENTTYPES.ERROR,
    status: STATUS_CODE.ERROR,
    time: getTimestamp(),
    message: message,
    line: lineNumber,
    column: columnNumber,
  };
  transportData.send(errorData);
}
export default {
  install,
  use,
  init,
  captureError,
};
