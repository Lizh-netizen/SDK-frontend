(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global["web-see"] = {}));
})(this, (function (exports) { 'use strict';

  /**
   * 事件类型
   */
  exports.EVENTTYPES = void 0;
  (function (EVENTTYPES) {
      EVENTTYPES["XHR"] = "xhr";
      EVENTTYPES["FETCH"] = "fetch";
      EVENTTYPES["CLICK"] = "click";
      EVENTTYPES["HISTORY"] = "history";
      EVENTTYPES["ERROR"] = "error";
      EVENTTYPES["HASHCHANGE"] = "hashchange";
      EVENTTYPES["UNHANDLEDREJECTION"] = "unhandledrejection";
      EVENTTYPES["RESOURCE"] = "resource";
      EVENTTYPES["DOM"] = "dom";
      EVENTTYPES["VUE"] = "vue";
      EVENTTYPES["REACT"] = "react";
      EVENTTYPES["CUSTOM"] = "custom";
      EVENTTYPES["PERFORMANCE"] = "performance";
      EVENTTYPES["RECORDSCREEN"] = "recordScreen";
      EVENTTYPES["WHITESCREEN"] = "whiteScreen";
  })(exports.EVENTTYPES || (exports.EVENTTYPES = {}));
  /**
   * 用户行为
   */
  exports.BREADCRUMBTYPES = void 0;
  (function (BREADCRUMBTYPES) {
      BREADCRUMBTYPES["HTTP"] = "Http";
      BREADCRUMBTYPES["CLICK"] = "Click";
      BREADCRUMBTYPES["RESOURCE"] = "Resource_Error";
      BREADCRUMBTYPES["CODEERROR"] = "Code_Error";
      BREADCRUMBTYPES["ROUTE"] = "Route";
      BREADCRUMBTYPES["CUSTOM"] = "Custom";
  })(exports.BREADCRUMBTYPES || (exports.BREADCRUMBTYPES = {}));
  /**
   * 状态
   */
  exports.STATUS_CODE = void 0;
  (function (STATUS_CODE) {
      STATUS_CODE["ERROR"] = "error";
      STATUS_CODE["OK"] = "ok";
  })(exports.STATUS_CODE || (exports.STATUS_CODE = {}));
  exports.HTTP_CODE = void 0;
  (function (HTTP_CODE) {
      HTTP_CODE[HTTP_CODE["BAD_REQUEST"] = 400] = "BAD_REQUEST";
      HTTP_CODE[HTTP_CODE["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
  })(exports.HTTP_CODE || (exports.HTTP_CODE = {}));
  /**
   * 接口错误状态
   */
  exports.SpanStatus = void 0;
  (function (SpanStatus) {
      SpanStatus["Ok"] = "ok";
      SpanStatus["DeadlineExceeded"] = "deadline_exceeded";
      SpanStatus["Unauthenticated"] = "unauthenticated";
      SpanStatus["PermissionDenied"] = "permission_denied";
      SpanStatus["NotFound"] = "not_found";
      SpanStatus["ResourceExhausted"] = "resource_exhausted";
      SpanStatus["InvalidArgument"] = "invalid_argument";
      SpanStatus["Unimplemented"] = "unimplemented";
      SpanStatus["Unavailable"] = "unavailable";
      SpanStatus["InternalError"] = "internal_error";
      SpanStatus["UnknownError"] = "unknown_error";
      SpanStatus["Cancelled"] = "cancelled";
      SpanStatus["AlreadyExists"] = "already_exists";
      SpanStatus["FailedPrecondition"] = "failed_precondition";
      SpanStatus["Aborted"] = "aborted";
      SpanStatus["OutOfRange"] = "out_of_range";
      SpanStatus["DataLoss"] = "data_loss";
  })(exports.SpanStatus || (exports.SpanStatus = {}));

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.js.map
