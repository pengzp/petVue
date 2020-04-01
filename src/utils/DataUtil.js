let util = {}

/**
 *
 * @param array
 * @param data
 * @param key
 */
util.updateData = function (array, data, key) {
  var newArray = [];
  array.forEach(function (item, index) {
    if (item[key] == data[key]) {
      newArray.push(data);
    } else {
      newArray.push(item);
    }
  })
  return newArray;
}


util.containsData = function (array, data, key) {
  for (var i = 0; i < array.length; i++) {
    var item = array[i];
    if (item[key] == data[key]) {
      return true;
    }
  }
  return false;
}

util.deleteData = function (array, value, key) {
  var newArray = [];
  array.forEach(function (item, index) {
    if (item[key] != value) {
      newArray.push(item);
    }
  })
  return newArray;
}

util.array2String = function (array, key) {
  var str = "";
  for (var i = 0; i < array.length; i++) {
    if (i != array.length - 1) {
      str += array[i][key] + ",";
    } else {
      str += array[i][key];
    }
  }
  return str;
}

export default util;
