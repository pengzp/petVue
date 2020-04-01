import L from 'leaflet';

/**
 * 图形范围
 **/


L.Control.oneMapRangeControl = L.Control.extend({
  options: {
    coordinates: {}
  },
  initialize: function (options) {
    this._zjGeometries = options.zjGeometries
    this._djGeometries = options.djGeometries
    this._jgGeometries = options.hgGeometries
    this._jxGeometries = options.jxGeometries
    this._callBack = options.callBack
    this._jxCallBack = options.jxCallback
    this._vue = options.vue;
  },
  onAdd: function (map) {
    const container = L.DomUtil.create('div', this.options['containerClass']);
    this._zoneControlContainer = L.DomUtil.create('div', 'one-zone-control-container');
    const pzfwItemContainer = L.DomUtil.create('div', 'one-zone-control-item');
    const pzfwIcon = L.DomUtil.create('div', 'one-zone-control-icon');
    pzfwItemContainer.appendChild(pzfwIcon);
    const pzfwTitle = L.DomUtil.create('div', 'one-zone-control-item-title');
    pzfwTitle.innerHTML = "选点";
    pzfwItemContainer.appendChild(pzfwTitle);

    const gxfwItemContainer = L.DomUtil.create('div', 'one-zone-control-item');
    const gxfwIcon = L.DomUtil.create('div', 'one-zone-control-icon');
    gxfwItemContainer.appendChild(gxfwIcon);
    const gxfwTitle = L.DomUtil.create('div', 'one-zone-control-item-title');
    gxfwTitle.innerHTML = "勘测";
    gxfwItemContainer.appendChild(gxfwTitle);

    const fzfwItemContainer = L.DomUtil.create('div', 'one-zone-control-item');
    const fzfwIcon = L.DomUtil.create('div', 'one-zone-control-icon');
    fzfwItemContainer.appendChild(fzfwIcon);
    const fzfwTitle = L.DomUtil.create('div', 'one-zone-control-item-title');
    fzfwTitle.innerHTML = "竣工";
    fzfwItemContainer.appendChild(fzfwTitle);

    const jxItemContainer = L.DomUtil.create('div', 'one-zone-control-item');
    const jxIcon = L.DomUtil.create('div', 'one-zone-control-icon');
    jxItemContainer.appendChild(jxIcon);
    const jxTitle = L.DomUtil.create('div', 'one-zone-control-item-title');
    jxTitle.innerHTML = "建新";
    jxItemContainer.appendChild(jxTitle);


    this._zoneControlContainer.appendChild(pzfwItemContainer);
    this._zoneControlContainer.appendChild(gxfwItemContainer);
    this._zoneControlContainer.appendChild(fzfwItemContainer);
    this._zoneControlContainer.appendChild(jxItemContainer);
    container.appendChild(this._zoneControlContainer);

    L.DomEvent.on(pzfwItemContainer, 'click', this._switchPzData, this);
    L.DomEvent.on(gxfwItemContainer, 'click', this._switchGxData, this);
    L.DomEvent.on(fzfwItemContainer, 'click', this._switchFzData, this);
    L.DomEvent.on(jxItemContainer, 'click', this._switchJxData, this);

    L.DomEvent.on(this._zoneControlContainer, 'mouseover', this._disableMapHandler, this);
    L.DomEvent.on(this._zoneControlContainer, 'mouseleave', this._enableMapHandler, this);
    L.DomEvent.on(this._zoneControlContainer, 'mousedown dblclick onmousewheel', this._stopMapPropagation, this);
    this._initData(this, gxfwItemContainer);
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
  _initData: function (el, dj) {
    var _this = this
    let djLayers=[]
    if (this._djGeometries != null) {
      for(var i =0;i<this._zjGeometries.length;i++){
        var djLayer = L.geoJSON(this._djGeometries[i], {color:'#00BFFF',weight:1,fill:true,fillColor:'#00BFFF',fillOpacity:0.2}).addTo(this._map)
        djLayer.on('click',function(e){
          let fea = e.layer.feature
          let landId = fea.properties.landId
          let name = fea.properties.name
          _this._callBack(landId,name)
        })
        djLayers.push(djLayer)
      }
      this._djLayers = djLayers
      if (!L.DomUtil.hasClass(dj, 'selected')) {
        L.DomUtil.addClass(dj, 'selected');
      }
      
    }
  },
  _switchPzData: function (el) {
    var _this = this
    if (this._zjGeometries != null) {
      var node = el.currentTarget;
      if (!L.DomUtil.hasClass(node, 'selected')) {
        let zjLayers =[]
        L.DomUtil.addClass(node, 'selected');
        for(var i =0;i<this._zjGeometries.length;i++){
          var zjLayer = L.geoJSON(this._zjGeometries[i], {color:'#00FF00',weight:1,dashArray:4,fill:true,fillColor:'#00FF00',fillOpacity:0.2}).addTo(this._map)
          zjLayer.on('click',function(e){
            let fea = e.layer.feature
            let landId = fea.properties.landId
            let name = fea.properties.name
            _this._callBack(landId,name)
          })
          zjLayers.push(zjLayer)
        }
        this._zjLayers = zjLayers
      } else {
        L.DomUtil.setClass(node, 'one-zone-control-item');
        for(var i=0;i<this._zjLayers.length;i++){
          this._map.removeLayer(this._zjLayers[i])
        }
        this._zjLayers = null
      }
      
    } else {
      this._vue.$Notice.warning({
        title: '无法展示',
        desc: '该地图没有上传指界图形'
      });
    }

  },
  _switchGxData: function (el) {
    var _this = this
    if (this._djGeometries != null) {
      var node = el.currentTarget;
      if (!L.DomUtil.hasClass(node, 'selected')) {
        let djLayers =[]
        L.DomUtil.addClass(node, 'selected');
        for(var i =0;i<this._djGeometries.length;i++){
          var djLayer = L.geoJSON(this._djGeometries[i], {color:'#00BFFF',weight:1,fill:true,fillColor:'#00BFFF',fillOpacity:0.2}).addTo(this._map)
          djLayer.on('click',function(e){
            let fea = e.layer.feature
            let landId = fea.properties.landId
            let name = fea.properties.name
            _this._callBack(landId,name)
          })
          djLayers.push(djLayer)
        }
        this._djLayers = djLayers
      } else {
        L.DomUtil.setClass(node, 'one-zone-control-item');
        for(var i=0;i<this._djLayers.length;i++){
          this._map.removeLayer(this._djLayers[i])
        }
        this._djLayers = null
      }
      
    } else {
      this._vue.$Notice.warning({
        title: '无法展示',
        desc: '该地图没有上传指界图形'
      });
    }

  },
  _switchFzData: function (el) {
    var _this = this
    if (this._jgGeometries != null) {
      var node = el.currentTarget;
      if (!L.DomUtil.hasClass(node, 'selected')) {
        let jgLayers =[]
        L.DomUtil.addClass(node, 'selected');
        for(var i =0;i<this._jgGeometries.length;i++){
          var jgLayer = L.geoJSON(this._jgGeometries[i], {color:'#00FF00',weight:1,dashArray:4,fill:false,fillColor:'#00FF00',fillOpacity:0.2}).addTo(this._map)
          jgLayer.on('click',function(e){
            let fea = e.layer.feature
            let landId = fea.properties.landId
            let name = fea.properties.name
            _this._callBack(landId,name)
          })
          jgLayers.push(jgLayer)
        }
        this._jgLayers = jgLayers
      } else {
        L.DomUtil.setClass(node, 'one-zone-control-item');
        for(var i=0;i<this._jgLayers.length;i++){
          this._map.removeLayer(this._jgLayers[i])
        }
        this._jgLayers = null
      }
      
    } else {
      this._vue.$Notice.warning({
        title: '无法展示',
        desc: '该地图没有上传指界图形'
      });
    }
  },
  _switchJxData:function(el){
    var _this = this
    if(this._jxGeometries !=null){
      var node = el.currentTarget;
      if (!L.DomUtil.hasClass(node, 'selected')) {
        let jxLayers =[]
        L.DomUtil.addClass(node, 'selected');
        for(var i =0;i<this._jxGeometries.length;i++){
          var jxlyr =null
          if(this._jxGeometries[i].properties.hook ==0){
            jxlyr = L.geoJSON(this._jxGeometries[i], {color:'#ff9900',weight:1,dashArray:4,fill:false,fillColor:'#ff9900',fillOpacity:0.2}).addTo(this._map)
          }else{
            jxlyr = L.geoJSON(this._jxGeometries[i], {color:'#f128c0',weight:1,fill:true,fillColor:'#f128c0',fillOpacity:0.2}).addTo(this._map)
          }
          jxLayers.push(jxlyr)
        }
        this._jxLayers = jxLayers
        this._jxCallBack(true)
      } else {
        L.DomUtil.setClass(node, 'one-zone-control-item');
        for(var i=0;i<this._jxLayers.length;i++){
          this._map.removeLayer(this._jxLayers[i])
        }
        this._jxLayers = null
        this._jxCallBack(false)
      }
    }
    
  }
});

L.Control.OneMapRangeControl = function (options) {
  return new L.Control.oneMapRangeControl(options);
};

export default L;
