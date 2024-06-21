import { ErrorTarget, HttpData } from '@webmon/types/src/core/base';
import { EVENTTYPES, STATUS_CODE } from '@webmon/common/src';
// 解析堆栈信息
import ErrorStackParser from 'error-stack-parser';
import { getErrorUid, getTimestamp, hashMapExist, unknownToString } from '@webmon/utils/src/core/helpers';
import { options } from './index';
import { transportData } from './reportData';
import { httpTransform, resourceTransform } from './transformData';
import { breadcrumb } from './breadcrumb';
const HandleEvents = {
  // 处理xhr、fetch回调
  handleHttp(data: HttpData, type: EVENTTYPES): void {
    const result = httpTransform(data);
    // 请求状态码error的时候上报错误
    if (result.status === 'error') {
      // 上报接口错误
      transportData.send({ ...result, type, status: STATUS_CODE.ERROR });
    }
  },
  // 以error为例
  handleError(ev: ErrorTarget): void {
    const target = ev.target;
    if (!target || (ev.target && !ev.target.localName)) {
      // vue和react捕获的报错使用ev解析，异步错误使用ev.error解析
      const stackFrame = ErrorStackParser.parse(!target ? ev : ev.error)[0];
      const { fileName, columnNumber, lineNumber } = stackFrame;
      const errorData = {
        type: EVENTTYPES.ERROR,
        status: STATUS_CODE.ERROR,
        time: getTimestamp(),
        message: ev.message,
        fileName,
        line: lineNumber,
        column: columnNumber,
      };
      breadcrumb.push({
        type: EVENTTYPES.ERROR,
        category: breadcrumb.getCategory(EVENTTYPES.ERROR),
        data: errorData,
        time: getTimestamp(),
        status: STATUS_CODE.ERROR,
      });
      const hash: string = getErrorUid(`${EVENTTYPES.ERROR}-${ev.message}-${fileName}-${columnNumber}`);
      // 开启repeatCodeError第一次报错才上报
      if (!options.repeatCodeError || (options.repeatCodeError && !hashMapExist(hash))) {
        return transportData.send(errorData);
      }
    }

    // 资源加载报错
    if (target?.localName) {
      // 提取资源加载的信息
      const data = resourceTransform(target);
      return transportData.send({
        ...data,
        type: EVENTTYPES.RESOURCE,
        status: STATUS_CODE.ERROR,
      });
    }
  },
  handleUnhandleRejection(ev: PromiseRejectionEvent): void {
    console.log(ev);
    const stackFrame = ErrorStackParser.parse(ev.reason)[0];
    const { fileName, columnNumber, lineNumber } = stackFrame;
    const message = unknownToString(ev.reason.message || ev.reason.stack);
    const data = {
      type: EVENTTYPES.UNHANDLEDREJECTION,
      status: STATUS_CODE.ERROR,
      time: getTimestamp(),
      message,
      fileName,
      line: lineNumber,
      column: columnNumber,
    };
    const hash: string = getErrorUid(`${EVENTTYPES.UNHANDLEDREJECTION}-${message}-${fileName}-${columnNumber}`);
    // 开启repeatCodeError第一次报错才上报
    if (!options.repeatCodeError || (options.repeatCodeError && !hashMapExist(hash))) {
      transportData.send(data);
    }
  },
};

export { HandleEvents };
