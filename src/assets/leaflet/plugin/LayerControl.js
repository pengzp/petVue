import L from 'leaflet';
import * as esri from 'esri-leaflet';

L.Control.layerControl = L.Control.extend({
  options: {
    layerGroups: [],
    layerType: 'esri'
  },
  initialize: function (options) {
    L.Util.setOptions(this, options);
    this._layerGroups = options.layerGroups;
    this.sortGroupLayers();//排序
  },
  onAdd: function (map) {
    this.initMapLayers();//初始化加载图层
    //创建视图
    const container = L.DomUtil.create('div', this.options['containerClass']);
    this._layerControlBtn = L.DomUtil.create('div', 'control-btn');
    const icon = L.DomUtil.create('div', 'layer-icon');
    this._layerControlBtn.appendChild(icon);
    const span = L.DomUtil.create('span');
    span.innerHTML="图层";
    this._layerControlBtn.appendChild(span);
    this._layersContainer = L.DomUtil.create('div', 'layers-control-container');
    const controlLabel = L.DomUtil.create('div', 'control-label');
    controlLabel.innerHTML = "图层控制";
    this._layersContainer.appendChild(controlLabel);
    const groupsContainer = L.DomUtil.create('div', 'groups-container');
    this._layersContainer.appendChild(groupsContainer);
    for (var i = 0; i < this._layerGroups.length; i++) {
      var group = this._layerGroups[i];
      var groupItem = null;
      if (group.open) {
        groupItem = L.DomUtil.create('div', 'group-item open');
      } else {
        groupItem = L.DomUtil.create('div', 'group-item close');
      }
      var groupTitle = L.DomUtil.create('div', 'group-title');
      groupTitle.innerHTML = group.name;
      L.DomEvent.on(groupTitle, 'click', this._showGroupLayers, this);
      var groupArrow = L.DomUtil.create('i', 'fa layer-group-arrow');
      groupTitle.appendChild(groupArrow);
      groupItem.appendChild(groupTitle);
      var layers = group.layers;
      for (var j = 0; j < layers.length; j++) {
        var layer = layers[j];
        var layerItem = L.DomUtil.create('div', 'layer-item');
        var layerName = L.DomUtil.create('div', 'layer-name');
        layerName.innerHTML = layer.name;
        layerItem.appendChild(layerName);
        var layerSwitch = L.DomUtil.create('div', 'layer-switch');
        var layerswitchBtn = null;
        if (layer.visible) {
          layerswitchBtn = L.DomUtil.create('span', 'layer-switch-btn layer-switch-btn-checked');
        } else {
          layerswitchBtn = L.DomUtil.create('span', 'layer-switch-btn');
        }
        layerswitchBtn.setAttribute("id", layer.id);
        L.DomEvent.on(layerswitchBtn, 'click', this._onSwitchLayer, this);
        var layerSwitchBtnInner = L.DomUtil.create('span', 'layer-switch-btn-inner');
        layerswitchBtn.appendChild(layerSwitchBtnInner);
        layerSwitch.appendChild(layerswitchBtn);
        layerItem.appendChild(layerSwitch);
        groupItem.appendChild(layerItem);
      }
      groupsContainer.appendChild(groupItem);
    }
    container.appendChild(this._layerControlBtn);
    container.appendChild(this._layersContainer);
    //绑定事件
    L.DomEvent.on(this._layerControlBtn, 'mouseover', this._showControlContainer, this);
    L.DomEvent.on(this._layersContainer, 'mouseleave', this._hideControlContainer, this);
    L.DomEvent.on(this._layersContainer, 'mousedown dblclick onmousewheel', this._stopMapPropagation, this);
    return container;
  },
  _showControlContainer: function () {
    if (!L.DomUtil.hasClass(this._layersContainer, 'show')) {
      L.DomUtil.addClass(this._layersContainer, 'show');
      this._map.scrollWheelZoom.disable();
      this._map.dragging.disable();
    }
  },
  _hideControlContainer: function () {
    if (L.DomUtil.hasClass(this._layersContainer, 'show')) {
      L.DomUtil.setClass(this._layersContainer, 'layers-control-container');
      this._map.scrollWheelZoom.enable();
      this._map.dragging.enable();
    }
  },
  _showGroupLayers: function (el) {
    var groupItem = el.currentTarget.parentNode;
    if (!L.DomUtil.hasClass(groupItem, 'open')) {
      L.DomUtil.setClass(groupItem, 'group-item open');
    } else {
      L.DomUtil.setClass(groupItem, 'group-item close');
    }
  },
  _onSwitchLayer: function (el) {
    var layerswitchBtn = el.currentTarget;
    var id = layerswitchBtn.getAttribute("id");
    var layer = this.getLayerById(id);
    if (!L.DomUtil.hasClass(layerswitchBtn, 'layer-switch-btn-checked')) {
      layer.setOpacity(1);
      L.DomUtil.addClass(layerswitchBtn, 'layer-switch-btn-checked');
    } else {
      layer.setOpacity(0);
      L.DomUtil.setClass(layerswitchBtn, 'layer-switch-btn');
    }
  },
  _stopMapPropagation: function (el) {//屏蔽地图事件
    L.DomEvent.stopPropagation(el);
  },
  sortGroupLayers: function () {//排序
    var groups = [];
    for (var i = 0; i < this._layerGroups.length; i++) {
      var layers = [];
      for (var j = 0; j < this._layerGroups[i].layers.length; j++) {
        layers[this._layerGroups[i].layers[j].index] = this._layerGroups[i].layers[j];
      }
      var group = this._layerGroups[i];
      group.layers = layers;
      groups[group.index] = group;
    }
    this._layerGroups = groups;
  },
  initMapLayers: function () {
    for (var i = 0; i < this._layerGroups.length; i++) {
      var group = this._layerGroups[i];
      var layers = group.layers;
      for (var j = 0; j < layers.length; j++) {
        var layer = layers[j];
        var opacity = 1;
        if (!layer.visible) {
          opacity = 0;
        }
        if (layer.type == "title") {
          var layerObj = esri.tiledMapLayer({
            // maxZoom:6,
            // minZoom:0,
            //detectRetina:true,
            url: layer.url,
            opacity: opacity
          }).addTo(this._map);
          layer.layer = layerObj;
          layer.id = this.uuid();
        }else if(layer.type == "feature"){
          var layerObj = esri.featureLayer({
            url: layer.url,
            opacity: opacity
          }).addTo(this._map);
          layer.layer = layerObj;
          layer.id = this.uuid();
        }else if(layer.type == 'dynamic'){
          var layerObj = esri.dynamicMapLayer({
            url:layer.url,
            opacity:opacity
          }).addTo(this._map);
          layer.layer = layerObj;
          layer.id = this.uuid();
        }
      }
    }
  },

  getLayerById: function (id) {
    for (var i = 0; i < this._layerGroups.length; i++) {
      var group = this._layerGroups[i];
      var layers = group.layers;
      for (var j = 0; j < layers.length; j++) {
        var layer = layers[j];
        if (layer.id == id) {
          return layer.layer;
        }
      }
    }
  },
  uuid: function () {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
  }
});


L.Control.LayerControl = function (options) {
  return new L.Control.layerControl(options);
};

export default L;
