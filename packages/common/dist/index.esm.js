/**
 * 事件类型
 */
var EVENTTYPES;
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
})(EVENTTYPES || (EVENTTYPES = {}));
/**
 * 用户行为
 */
var BREADCRUMBTYPES;
(function (BREADCRUMBTYPES) {
    BREADCRUMBTYPES["HTTP"] = "Http";
    BREADCRUMBTYPES["CLICK"] = "Click";
    BREADCRUMBTYPES["RESOURCE"] = "Resource_Error";
    BREADCRUMBTYPES["CODEERROR"] = "Code_Error";
    BREADCRUMBTYPES["ROUTE"] = "Route";
    BREADCRUMBTYPES["CUSTOM"] = "Custom";
})(BREADCRUMBTYPES || (BREADCRUMBTYPES = {}));
/**
 * 状态
 */
var STATUS_CODE;
(function (STATUS_CODE) {
    STATUS_CODE["ERROR"] = "error";
    STATUS_CODE["OK"] = "ok";
})(STATUS_CODE || (STATUS_CODE = {}));
var HTTP_CODE;
(function (HTTP_CODE) {
    HTTP_CODE[HTTP_CODE["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HTTP_CODE[HTTP_CODE["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
})(HTTP_CODE || (HTTP_CODE = {}));
/**
 * 接口错误状态
 */
var SpanStatus;
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
})(SpanStatus || (SpanStatus = {}));

export { BREADCRUMBTYPES, EVENTTYPES, HTTP_CODE, STATUS_CODE, SpanStatus };
//# sourceMappingURL=index.esm.js.map
