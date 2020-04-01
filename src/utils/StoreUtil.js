//同步vuex数据
import StorageUtil from './StorageUtil'
import Constant from './Constant'

let util = {}

util.init = function (component) {
  //同步用户信息
  let user = StorageUtil.select(Constant.USER_KEY)
  if (user !== null) {
    component.$store.dispatch("updateUser", user);
  }
  let password = StorageUtil.select(Constant.PASSWORD_KEY)
  if (password !== null) {
    component.$store.dispatch("updatePassword", password);
  }
}

export default util;
