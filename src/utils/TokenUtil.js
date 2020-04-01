//token工具类
import CookieUtil from './CookiesUtil'

/**
 * 前缀名，前缀名后面是真正的token值
 * @type {string}
 */
const tokenPrefix = window.ApplicationConfig.tokenPrefix;

const TOKEN_KEY = window.ApplicationConfig.tokenKey;
// const TOKEN_KEY = "token";

const TOKEN_EXPIRATE_KEY = "expirate_time";


let TokenUtil = {}

/**
 * 获取当前token
 */
TokenUtil.getToken = function () {
  let tokenInfo = CookieUtil.get(TOKEN_KEY)
  if (!tokenInfo)
    return null;
  return tokenInfo;
}

/**
 * 设置token值
 * @param token
 * @param expirated 到期时间
 */
TokenUtil.setToken = function (token, expirated) {
  CookieUtil.put(TOKEN_KEY, token)
  CookieUtil.put(TOKEN_EXPIRATE_KEY, expirated)
}

/**
 * 判断token是否到期
 */
TokenUtil.isExpirated = function () {
  let expirateInfo = CookieUtil.get(TOKEN_EXPIRATE_KEY)
  if (expirateInfo) {
    let expiratedTime = parseInt(expirateInfo);
    let currentTime = new Date().getTime();
    return currentTime > expiratedTime;
  }
  return true;
}

/**
 * 删除token
 */
TokenUtil.removeToken = function () {
  CookieUtil.remove(TOKEN_KEY);
  CookieUtil.remove(TOKEN_EXPIRATE_KEY);
}


export default TokenUtil
