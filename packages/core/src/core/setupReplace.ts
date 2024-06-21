import { EVENTTYPES } from '@webmon/common/src';
import { HandleEvents } from './handleEvents';
import { addReplaceHandler } from './replace';

export function setupReplace(): void {
  // 重写XMLHttpRequest
  addReplaceHandler({
    callback: (data) => {
      HandleEvents.handleHttp(data, EVENTTYPES.XHR);
    },
    type: EVENTTYPES.XHR,
  });
  // 重写fetch
  addReplaceHandler({
    callback: (data) => {
      HandleEvents.handleHttp(data, EVENTTYPES.FETCH);
    },
    type: EVENTTYPES.FETCH,
  });
  // 捕获错误
  addReplaceHandler({
    callback: (error) => {
      HandleEvents.handleError(error);
    },
    type: EVENTTYPES.ERROR,
  });
  // 添加handleUnhandleRejection事件
  addReplaceHandler({
    callback: (data) => {
      HandleEvents.handleUnhandleRejection(data);
    },
    type: EVENTTYPES.UNHANDLEDREJECTION,
  });
}
