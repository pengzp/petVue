/**
 * 信息弹窗
 */
import _PopInfoWindow from './_PopInfoWindow'
import Vue from 'vue'
import './_pop-info-window.scss'

class FeaturePopInfoAbility {
  constructor(opts) {
    this._opts = Object.assign({}, opts);
  }

  addTo(layer) {
    let that = this;
    if (!layer) {
      console.error(`FeaturePopInfoAbility must add to a layer`);
    }
    layer.on('click', function (evt) {
      //如果有已经绑定直接弹出 没有则进行绑定
      if (evt.sourceTarget.getPopup()) {
        evt.sourceTarget.openPopup();
      } else {
        const Instance = new Vue({
          render(h) {
            return h(_PopInfoWindow, {
              props: {
                title: '信息',
                properties: evt.sourceTarget.feature.properties
              }
            })
          }
        });
        const component = Instance.$mount();
        evt.sourceTarget.bindPopup(component.$el, {
          className: 'feature-info-window',
          maxWidth: 600
        }).openPopup();
      }
    });
  }
}

export default FeaturePopInfoAbility;
