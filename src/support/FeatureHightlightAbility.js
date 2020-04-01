/**
 * 鼠标移动到feature上高亮显示
 *
 */

import * as esri from 'esri-leaflet'

class FeatureHightlightAbility {
  constructor(opts) {
    this._opts = Object.assign({
      color: '#ff0000',
    }, opts);
  }

  /**
   *
   * @param layer
   */
  addTo(layer) {
    let that = this;
    if (!layer) {
      console.error(`FeatureHightlightAbility must add to a  layer`);
    }
    layer.on('mouseover', function (evt) {
      evt.sourceTarget.setStyle({
        color: that._opts.color,
      });
    });
    layer.on('mouseout', function (evt) {
      layer.resetStyle(evt.sourceTarget);
    });
  }
}

export default FeatureHightlightAbility;
