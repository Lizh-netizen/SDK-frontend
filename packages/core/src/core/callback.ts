import { EVENTTYPES } from '@websee/common';
import { nativeTryCatch } from '@webmon/utils/src/core/helpers';
import { ReplaceCallback, ReplaceHandler } from '@webmon/types/src/core/base';
import { getFlag, setFlag } from '@websee/utils';
// 订阅发布模式，先订阅事件，然后错误时发布通知，存储handler这个对象，然后在适当的时机调用，回调主要是对数据进行上报以及简单的处理
const handlers: { [key in EVENTTYPES]?: ReplaceCallback[] } = {};
// subscribeEvent 设置标识，并将处理的方法放置到handlers中，{ xhr: [ funtion ] }
export function subscribeEvent(handler: ReplaceHandler): boolean {
  if (!handler || getFlag(handler.type)) return false;
  setFlag(handler.type, true);
  handlers[handler.type] = handlers[handler.type] || [];
  handlers[handler.type]?.push(handler.callback);
  return true;
}
export function notify(type: EVENTTYPES, data?: any): void {
  if (!type || !handlers[type]) return;
  // 获取对应事件的回调函数并执行，回调函数为addReplaceHandler事件中定义的事件
  handlers[type]?.forEach((callback) => {
    nativeTryCatch(
      () => {
        callback(data);
      },
      () => {
        // console.error(
        //   `web-see 重写事件notify的回调函数发生错误\nType:${type}\nName: ${getFunctionName(
        //     callback
        //   )}\nError: ${e}`
        // );
      }
    );
  });
}
