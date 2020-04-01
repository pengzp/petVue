import Stroage from './StorageUtil'
import Constant from './Constant'
import routers from '../router'

let util = {}

/**
 * 判断路由是否存在
 * @param path
 */
util.isExist = function (to) {
  let path = to.path;
  if (path == "/login" || path == "/lock" || path == "/403" || path == "/404" || path == "/500"|| path == "/") {
    return true;
  }
  return forEachRoute(routers, to.name);
}

function forEachRoute(routers, name) {
  for (var i = 0; i < routers.length; i++) {
    var route = routers[i];
    if (route.name == name)
      return true;
    if (route.children != null) {
      var result = forEachRoute(route.children, name);
      if (result)
        return true;
    }
  }
  return false;
}



/**
 * 判断是否有权访问该路由
 * @param path
 */
util.hasPermission = function (path) {
  if (path == "/login" || path == "/lock" || path == "/403" || path == "/404" || path == "/500"|| path == "/") {
    return true;
  }
  let user = Stroage.select(Constant.USER_KEY)
  let menus = user.menus;
  let functions = []
  if(menus.CountryMenus){
    functions = menus.CountryMenus
  }
  if(menus.TownMenus){
    functions = menus.TownMenus
  }
  // if(menus.companyMenus){
  //   functions = menus.companyMenus
  // }
  // if(menus.countryCompanyMenus){
  //   functions = menus.countryCompanyMenus
  // }
  if (functions != null) {
    if (!Array.isArray(this.functions) && functions.parentId == -1) {
      functions = functions.children;
    }else {
      for(let j=0;j<functions.length;j++){
        let arrayMenu=null;
        if (functions && functions[j]) {
          let menus = functions[j];
          if (menus.parentId == -1&&menus.children.length>0) {
            arrayMenu = menus.children;
          }else{
            if (path.indexOf(menus.menuRoute)!=-1) {
              return true;
            }
          }
        }

        for (var i = 0; i < arrayMenu.length; i++) {
          var fun = arrayMenu[i];
          if (path.indexOf(fun.menuRoute)!=-1) {
            return true;
          }
        }
      }
    }
    



  }
  return false;
}

/**
 * 获取用户的默页面
 * @param menus
 * @returns {null}
 */
util.getDefaultRouter = function (menus) {
  let funcMenus=[]
  if(menus.CountryMenus){
    funcMenus = menus.CountryMenus
  }
  if(menus.TownMenus){
    funcMenus = menus.TownMenus
  }
  if(funcMenus){
    if (!Array.isArray(funcMenus) && funcMenus.parentId == -1) {
      if(funcMenus.children!=null&&funcMenus.children.length>0){
        return funcMenus.children[0].menuRoute;
      }
    } else {
      if (funcMenus && funcMenus[0]) {
        let townMenu = funcMenus[0];
        if (townMenu.parentId == -1) {
          return townMenu.children[0].menuRoute;
        }else{
          return townMenu.menuRoute;
        }
      }
    }
  }
  return null;
}


export default util;
