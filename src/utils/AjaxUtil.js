import axios from 'axios'
import qs from 'qs'
import iView from 'iview'
import TokenUtil from './TokenUtil'

const baseUrl = window.ApplicationConfig.baseUrl

const tokenKey = window.ApplicationConfig.tokenKey


axios.defaults.withCredentials = false;

//全局配置取消
var CancelToken = axios.CancelToken;
var source = CancelToken.source();

/**
 * 请求前拦截
 * 添加加载进度条
 */
axios.interceptors.request.use(config => {
  iView.LoadingBar.start();
  if (config.requireToken) {
    let token = TokenUtil.getToken();
    let isExpirated = TokenUtil.isExpirated();
    if (!token || isExpirated) {
      //token超期跳转到登录页面,并取消请求
      TokenUtil.removeToken();
      config.vue.$router.push({path: '/login'});
      // source.cancel("without token cancel request");
    } else {
      config.headers[tokenKey] = token;
    }
  }
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 请求后拦截
 *
 */
axios.interceptors.response.use(response => {
  return response
}, error => {
  Promise.resolve(error.response)
  if (!error.response) {
    if (error.message == "without token cancel request") {//token过期会取消请求
      return {
        status: 9002,
        statusText: error.message
      }
    } else {
      return {
        status: 503,
        statusText: error.message
      }
    }
  } else {
    return error.response
  }

})


/**
 * 检查状态
 * 并对异常状态进行处理
 * @param response
 * @returns {*}
 */
function checkResponseStatus(response) {
  iView.LoadingBar.finish()
  if (response.status === 200 || response.status === 304) {
    let data = response.data;
    data.status = 200;
    return data
  }
  switch (response.status) {
    case 403:
      //权限不足
      return {
        status: response.status,
        message: "权限不足",
        data: response.data
      }
      break;
    case 404:
      //未找到页面,跳转
      break;
    case 500:
      //服务器内部错误
      return {
        status: response.status,
        message: response.statusText,
        data: response.statusText,
      }
      break;
    default:
      return {
        status: response.status,
        message: response.statusText,
        data: response.statusText,
      }
      break;
  }
}

/**
 * 检查状态码
 * @param res
 * @returns {*}
 */
function checkResponseCode(res) {
  if (res.status !== 200) {//网络请求存在问题
  }
  return res
}
/**
 * 导出方法
 */
export default {
  /**
   * post请求
   * @param url
   * @param data
   * @param vue vue 实例
   * @param requireToken
   * @returns {Promise<AxiosResponse<any>>}
   */
  post(url, data, vue, requireToken) {
    return axios({
      method: 'post',
      url: url,
      baseURL: baseUrl,
      data: data,
      timeout: 30000,
      vue: vue,
      cancelToken: source.token,
      requireToken: requireToken == null ? true : requireToken,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(checkResponseStatus).then(checkResponseCode)
  },
  /**
   * get请求
   * @param url
   * @param params
   * @param vue vue 实例
   * @param requireToken
   * @returns {Promise<AxiosResponse<any>>}
   */
  get(url, params, vue, requireToken) {
    return axios({
      method: 'get',
      url: url,
      baseURL: baseUrl,
      params: params,
      timeout: 30000,
      vue: vue,
      cancelToken: source.token,
      requireToken: requireToken == null ? true : requireToken,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(checkResponseStatus).then(checkResponseCode)
  },

  /**
   * post 下载文件
   * @param url
   * @param params
   * @param vue
   * @param requireToken
   * @returns {AxiosPromise}
   */
  postDownLoadFile(url, data, vue,requireToken ){
    return axios({
      method:'post',
      url:url,
      baseURL:baseUrl,
      data: data,
      timeout: 30000,
      vue: vue,
      cancelToken: source.token,
      requireToken: requireToken == null ? true : requireToken,
      responseType: 'arraybuffer',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Content-Disposition':''
      }
    }).then(checkResponseCode)
  },
  
  downLoadFile(url,data,title,vue,requireToken){
    return axios({
      method: 'post',
      url: url,
      baseURL: baseUrl,
      data: data,
      timeout: 30000,
      vue: vue,
      cancelToken: source.token,
      requireToken: requireToken == null ? true : requireToken,
      responseType: 'arraybuffer',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(checkResponseCode)
  }


}

