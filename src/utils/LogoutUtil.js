//登出
import TokenUtil from './TokenUtil'

let util = {}

util.logout = function (component) {
  component.$store.dispatch("removeUser");
  component.$store.dispatch("removePassword");
  TokenUtil.removeToken();
  component.$router.push({path: '/login'});
}

export default util;
