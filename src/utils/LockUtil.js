import CookieUtil from './CookiesUtil'
import StorageUtil from './StorageUtil'

const LOCK_KEY = "locking"
const LAST_PAGE_KEY = "last_page"
let util = {};

/**
 * 锁屏
 */
util.lock = function () {
  CookieUtil.put(LOCK_KEY, 1);
}

/**
 * 解锁
 */
util.unlock = function () {
  CookieUtil.put(LOCK_KEY, 0);
}

/**
 * 判断是否锁定
 */
util.isLocked = function () {
  var lock = CookieUtil.get(LOCK_KEY);
  if (lock == 1)
    return true;
  return false;
}

/**
 *
 */
util.setLastPage = function (path, param) {
  var obj = {};
  obj.path = path;
  obj.param = param;
  StorageUtil.insert(LAST_PAGE_KEY, obj);

}

util.getLastPage = function () {
  return StorageUtil.select(LAST_PAGE_KEY);
}

export default util;
