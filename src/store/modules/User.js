import StorageUtil from '../../utils/StorageUtil'
import Constant from '../../utils/Constant'

//用户信息操作
const state = {
  user: {
    avatar:null
  },
  password: {
    avatar:null
  }
}

const mutations = {
  UPDATE_USER_INFO(state, user) {
    state.user = user;
  },
  REMOVE_USER() {
    state.user = null;
  },
  UPDATE_PASSWORD_INFO(state, password) {
    state.password = password;
  },
  REMOVE_PASSWORD() {
    state.password = null;
  },
}

const getters = {}

const actions = {
  /**
   * 更新用户信息
   * @param state
   * @param user
   */
  updateUser: function (state, user) {
    this.commit('UPDATE_USER_INFO', user)
    StorageUtil.insert(Constant.USER_KEY, user)
  },
  /**
   * 更新用户登录输入的密码信息
   * @param state
   * @param password
   */
  updatePassword: function (state, password) {
    this.commit('UPDATE_PASSWORD_INFO', password)
    StorageUtil.insert(Constant.PASSWORD_KEY, password)
  },
  /**
   * 移除用户
   */
  removeUser: function () {
    this.commit('REMOVE_USER')
    StorageUtil.delete(Constant.USER_KEY)
  },
  /**
   * 移除用户登录输入的密码
   */
  removePassword: function () {
    this.commit('REMOVE_PASSWORD')
    StorageUtil.delete(Constant.PASSWORD_KEY)
  },
  /**
   * 更新用户但保留角色和权限信息
   * @param state
   * @param user
   */
  updateUserKeepRoleAndAuthorities: function (state, user) {
    user.authorities = state.state.user.authorities;
    user.roles = state.state.user.roles;
    this.commit('UPDATE_USER_INFO', user)
    StorageUtil.insert(Constant.USER_KEY, user)
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
