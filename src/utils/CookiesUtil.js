import Cookies from 'js-cookie'
//Cookie 操作工具
let cookie = {

};

/**
 * 保存键值对到cookie
 * @param key
 * @param value
 */
cookie.put = function (key, value) {
  Cookies.set(key, value);
}

/**
 * 获取cookie中值
 * @param key
 */
cookie.get = function (key) {
  return Cookies.get(key);
}

/**
 * 删除键值对
 * @param key
 */
cookie.remove = function (key) {
  Cookies.remove(key)
}

export default cookie;
