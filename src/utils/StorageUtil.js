/**
 * 浏览器Local Storage操作类
 * 主要用来存储对象
 */
class Storage {
  constructor() {
    this.storage = window.localStorage
    this.prefix = "polar_";//存储前缀名
  }

  /**
   * 新增
   * @param key
   * @param value 对象将被转成json字符串存储
   * @param fn
   */
  insert(key, value, fn) {
    try {
      value = JSON.stringify(value)
    } catch (e) {

    }
    this.storage.setItem(this.prefix + key, value)
    fn && fn()
  }

  /**
   * 查询
   * @param key
   * @param fn
   */
  select(key, fn) {
    if (!key) {
      throw new Error('can not found the key')
    }
    if (typeof key === 'object') {
      throw new Error(' the key can not be an object')
    }
    var value = this.storage.getItem(this.prefix + key)
    if (value !== null) {
      try {
        value = JSON.parse(value)
      } catch (e) {

      }
    }
    return value
  }

  /**
   * 删
   * @param key
   */
  delete(key) {
    this.storage.removeItem(this.prefix + key)
  }

  /**
   * 改
   * @param key
   * @param value
   * @param fn
   */
  update(key, value, fn) {
    this.insert(key, value, fn)
  }

  /**
   * 清除所有
   */
  clear(){
    this.storage.clear();
  }
}

export default new Storage()
