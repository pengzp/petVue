import L from 'leaflet';

L.Control.TianDiTuLayerControl = L.Control.extend({
  options: {
    position: 'topright' //初始位置
  },
  initialize: function (currentIndex, baseLayers, overlays, options) {
    this._layers = [];
    this._index = currentIndex;
    this._urls=[];
    L.Util.setOptions(this, options);
    for (var i in baseLayers) {
      this._addLayer(baseLayers[i], i);
    }
    if(this._index==1){
      this._layers[0].layer.setUrl(this._urls[1]);
    }
  },
  onAdd: function (map) {
    const container = L.DomUtil.create('div', this.options['containerClass']);
    this.layerButton = L.DomUtil.create('div', 'tool-button tool-layer');
    const icon = L.DomUtil.create('i', 'tool-layer-icon');
    // const span = L.DomUtil.create('div', 'tool-layer-name');
    // span.innerHTML="图层";
    this.layersContainer = L.DomUtil.create('div', 'map-open-container');
    const mapOpen = L.DomUtil.create('div', 'map-open');
    const mapsel = L.DomUtil.create('div', 'map-sel');
    if(this._index == 0){
      this.dt = L.DomUtil.create('a', 'map-dt selected');
      this.yx = L.DomUtil.create('a', 'map-yx');
    }else{
      this.dt = L.DomUtil.create('a', 'map-dt');
      this.yx = L.DomUtil.create('a', 'map-yx selected');
    }
    const span = L.DomUtil.create('div', 'tool-layer-name');
    span.innerHTML="地图";
    this.dt.appendChild(span)
    const yxspan = L.DomUtil.create('div', 'tool-layer-name');
    yxspan.innerHTML="影像";
    this.yx.appendChild(yxspan)


    mapsel.appendChild(this.dt);
    mapsel.appendChild(this.yx);
    mapOpen.appendChild(mapsel);
    this.layerButton.appendChild(icon);
    // this.layerButton.appendChild(span);
    this.layersContainer.appendChild(mapOpen);
    container.appendChild(this.layerButton);
    container.appendChild(this.layersContainer);

    L.DomEvent.on(this.layerButton, 'mouseover', this._show, this);
    L.DomEvent.on(this.layersContainer, 'mouseleave', this._hide, this);
    L.DomEvent.on(this.dt, 'click', this._showDt, this);
    L.DomEvent.on(this.yx, 'click', this._showYx, this);
    return container;

  },

  _addLayer: function (layer, name, overlay) {
    if (this._map) {
      layer.on('add remove', this._onLayerChange, this);
    }

    this._layers.push({
      layer: layer,
      name: name,
      overlay: overlay
    });
    this._urls.push(layer._url);
  },
  _onLayerChange: function (e) {
    // if (!this._handlingClick) {
    //   this._update();
    // }
    //
    // var obj = this._getLayer(Util.stamp(e.target));
    //
    // // @namespace Map
    // // @section Layer events
    // // @event baselayerchange: LayersControlEvent
    // // Fired when the base layer is changed through the [layer control](#control-layers).
    // // @event overlayadd: LayersControlEvent
    // // Fired when an overlay is selected through the [layer control](#control-layers).
    // // @event overlayremove: LayersControlEvent
    // // Fired when an overlay is deselected through the [layer control](#control-layers).
    // // @namespace Control.Layers
    // var type = obj.overlay ?
    //   (e.type === 'add' ? 'overlayadd' : 'overlayremove') :
    //   (e.type === 'add' ? 'baselayerchange' : null);
    //
    // if (type) {
    //   this._map.fire(type, obj);
    // }
  },

  _show() {
    if (!L.DomUtil.hasClass(this.layersContainer, 'map-open-show')) {
      L.DomUtil.addClass(this.layersContainer, 'map-open-show');
    }
  },

  _hide() {
    if (L.DomUtil.hasClass(this.layersContainer, 'map-open-show')) {
      L.DomUtil.setClass(this.layersContainer, 'map-open-container');
    }
  },
  _showDt() {
    this._layers[0].layer.setUrl(this._urls[0]);
    L.DomUtil.addClass(this.dt, 'selected');
    L.DomUtil.setClass(this.yx, 'map-yx');
    this._index=0;
  },
  _showYx() {
    this._layers[0].layer.setUrl(this._urls[1]);
    L.DomUtil.addClass(this.yx, 'selected');
    L.DomUtil.setClass(this.dt, 'map-dt');
    this._index=1;
  },
});

L.Control.tianDiTuLayerControl = function (currentIndex, baseLayers, overlays, options) {
  return new L.Control.TianDiTuLayerControl(currentIndex, baseLayers, overlays, options);
};

export default L;
