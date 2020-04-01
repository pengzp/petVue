let util = {};

/**
 * 日期格式化
 * @param date
 * @param fmt
 * @returns {*}
 */
util.formatDate = function (date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};

/**
 * 字符串转date对象 兼容ie 
 */
util.parseToDate=function(val){
  var fullDate = val.substr(0,10)
  return fullDate
  //var fullDate = val.split(" ")[0].split("-");
  //var fullTime = val.split(" ")[1].split(":");
  //let date= new Date(fullDate[0], fullDate[1]-1, fullDate[2], (fullTime[0] != null ? fullTime[0] : 0), (fullTime[1] != null ? fullTime[1] : 0), (fullTime[2] != null ? fullTime[2] : 0));
  //return date;
}

export default util;
