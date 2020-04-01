import L from 'leaflet';

/**
 * 图形范围
 **/


L.Control.rangeControl = L.Control.extend({
  options: {
    coordinates: {}
  },
  initialize: function (options) {
    this._zjtx = JSON.parse(options.zjtx);
    this._djtx = JSON.parse(options.djtx);
    this._jgtx = JSON.parse(options.jgtx);
    this._vue = options.vue;
  },
  onAdd: function (map) {
    const container = L.DomUtil.create('div', this.options['containerClass']);
    this._zoneControlContainer = L.DomUtil.create('div', 'zone-control-container');
    const pzfwItemContainer = L.DomUtil.create('div', 'zone-control-item');
    const pzfwIcon = L.DomUtil.create('div', 'zone-control-icon');
    pzfwItemContainer.appendChild(pzfwIcon);
    const pzfwTitle = L.DomUtil.create('div', 'zone-control-item-title');
    pzfwTitle.innerHTML = "选点";
    pzfwItemContainer.appendChild(pzfwTitle);

    const gxfwItemContainer = L.DomUtil.create('div', 'zone-control-item');
    const gxfwIcon = L.DomUtil.create('div', 'zone-control-icon');
    gxfwItemContainer.appendChild(gxfwIcon);
    const gxfwTitle = L.DomUtil.create('div', 'zone-control-item-title');
    gxfwTitle.innerHTML = "勘测";
    gxfwItemContainer.appendChild(gxfwTitle);

    const fzfwItemContainer = L.DomUtil.create('div', 'zone-control-item');
    const fzfwIcon = L.DomUtil.create('div', 'zone-control-icon');
    fzfwItemContainer.appendChild(fzfwIcon);
    const fzfwTitle = L.DomUtil.create('div', 'zone-control-item-title');
    fzfwTitle.innerHTML = "竣工";
    fzfwItemContainer.appendChild(fzfwTitle);


    this._zoneControlContainer.appendChild(pzfwItemContainer);
    this._zoneControlContainer.appendChild(gxfwItemContainer);
    this._zoneControlContainer.appendChild(fzfwItemContainer);
    container.appendChild(this._zoneControlContainer);

    L.DomEvent.on(pzfwItemContainer, 'click', this._switchPzData, this);
    L.DomEvent.on(gxfwItemContainer, 'click', this._switchGxData, this);
    L.DomEvent.on(fzfwItemContainer, 'click', this._switchFzData, this);

    L.DomEvent.on(this._zoneControlContainer, 'mouseover', this._disableMapHandler, this);
    L.DomEvent.on(this._zoneControlContainer, 'mouseleave', this._enableMapHandler, this);
    L.DomEvent.on(this._zoneControlContainer, 'mousedown dblclick onmousewheel', this._stopMapPropagation, this);
    this._initData(this, pzfwItemContainer);
    return container;
  },
  _stopMapPropagation: function (el) {//屏蔽地图事件
    L.DomEvent.stopPropagation(el);
  },
  _disableMapHandler: function () {
    this._map.scrollWheelZoom.disable();
    this._map.dragging.disable();
  },
  _enableMapHandler: function () {
    this._map.scrollWheelZoom.enable();
    this._map.dragging.enable();
  },
  _bindPopup: function (geometry, center) {

  },
  _initData: function (el, zj) {
    if (this._zjtx != null) {
      this._zjSketchLayer = L.geoJSON(this._zjtx, {
        style: {
          color: '#bea221',
          opacity: 1,
          fill: true,
          dashArray: 5
        }
      });
      this._zjSketchLayer.addTo(this._map);
      this._map.flyToBounds(this._zjSketchLayer.getBounds(), {maxZoom: 16});
      if (!L.DomUtil.hasClass(zj, 'selected')) {
        L.DomUtil.addClass(zj, 'selected');
      }
    }
  },
  _switchPzData: function (el) {
    if (this._zjtx != null) {
      var node = el.currentTarget;
      if (!L.DomUtil.hasClass(node, 'selected')) {
        L.DomUtil.addClass(node, 'selected');
        this._zjSketchLayer = L.geoJSON(this._zjtx, {
          style: {
            color: '#bea221',
            opacity: 1,
            fill: true,
            dashArray: 5
          }
        });
        this._zjSketchLayer.addTo(this._map);
        this._map.flyToBounds(this._zjSketchLayer.getBounds(), {maxZoom: 16});
      } else {
        L.DomUtil.setClass(node, 'zone-control-item');
        this._map.removeLayer(this._zjSketchLayer)
      }
    } else {
      this._vue.$Notice.warning({
        title: '无法展示',
        desc: '该地图没有上传指界图形'
      });
    }

  },
  _switchGxData: function (el) {
    if (this._djtx != null) {//存在数据
      var node = el.currentTarget;
      if (!L.DomUtil.hasClass(node, 'selected')) {
        L.DomUtil.addClass(node, 'selected');
        this._djSketchLayer = L.geoJSON(this._djtx, {
          style: {
            color: '#be3114',
            opacity: 1,
            fill: true,
            dashArray: 5
          }
        });
        this._djSketchLayer.addTo(this._map);
        this._map.flyToBounds(this._djSketchLayer.getBounds(), {maxZoom: 16});
      } else {
        L.DomUtil.setClass(node, 'zone-control-item');
        this._map.removeLayer(this._djSketchLayer);
      }
    } else {
      this._vue.$Notice.warning({
        title: '无法展示',
        desc: '还没有上传勘测定界图形'
      });
    }

  },
  _switchFzData: function (el) {
    if (this._jgtx != null) {
      var node = el.currentTarget;
      if (!L.DomUtil.hasClass(node, 'selected')) {
        L.DomUtil.addClass(node, 'selected');
        this._jgSketchLayer = L.geoJSON(this._jgtx, {
          style: {
            color: '#5755be',
            opacity: 1,
            fill: true,
            dashArray: 5
          }
        });
        this._jgSketchLayer.addTo(this._map);
        this._map.flyToBounds(this._jgSketchLayer.getBounds(), {maxZoom: 16});
      } else {
        L.DomUtil.setClass(node, 'zone-control-item');
        this._map.removeLayer(this._jgSketchLayer);
      }
    } else {
      this._vue.$Notice.warning({
        title: '无法展示',
        desc: '还没有上传竣工图形'
      });
    }

  }
});

L.Control.RangeControl = function (options) {
  return new L.Control.rangeControl(options);
};

export default L;
