import L from 'leaflet';

L.Control.DistrictControl = L.Control.extend({
  districtData: [],
  selectedCallback: null,
  selectedValues: [{
    name: '浙江省',
    code: '330000'
  },
    {
      name: '杭州市',
      code: '330100'
    },
    {
      name: '余杭区',
      code: '330110'
    }],
  options: {
    position: 'topleft'
  },
  initialize: function (data, selectedValues, options, selectedCallback) {
    L.Util.extend(this.options, options);
    this.selectedCallback = selectedCallback;
    this.districtData = data;
    if (selectedValues != null && selectedValues.length > 0) {
      this.selectedValues = selectedValues;
    }
    this.addTagInfo(this.districtData);
    console.log(this.districtData);
  },
  onAdd: function (map) {
    this._control = L.DomUtil.create('div', this.options['containerClass']); //嵌套mapcontainer的class
    L.DomUtil.addClass(this._control, "district-container");
    this._touchControl = L.DomUtil.create('div', 'touch-control');
    this._labelControl = L.DomUtil.create('div', 'label-control');
    if (this.selectedValues.length > 0) {
      this._labelControl.innerHTML = this.selectedValues[this.selectedValues.length - 1].name;
    }
    this._selectPanel = L.DomUtil.create('div', 'select-panel');
    L.DomUtil.addClass(this._selectPanel, 'unshow');
    this._loadSelectPanel();
    this._touchControl.appendChild(this._labelControl);
    this._touchControl.appendChild(this._selectPanel);
    this._bindingEvent();
    this._control.appendChild(this._touchControl);
    return this._control;
  },
  _loadSelectPanel: function () {
    this._provinceContainer = L.DomUtil.create('div', 'unit-container');
    this._cityContainer = L.DomUtil.create('div', 'unit-container');
    this._countyContainer = L.DomUtil.create('div', 'unit-container');
    this._townContainer = L.DomUtil.create('div', 'unit-container');

    this._provinceLabel = this._createLabel("省级");
    this._cityLabel = this._createLabel("市级");
    this._countyLabel = this._createLabel("县（市、区）")
    this._townLabel = this._createLabel('乡镇街道');
    this._provinceContainer.appendChild(this._provinceLabel);


    this.districtData.forEach(provinceConfig => {
      let province = L.DomUtil.create('div');
      if (this.selectedValues.length > 0 && this.selectedValues[0].name == provinceConfig.provinceName) {
        if (this.selectedValues.length == 1)
          L.DomUtil.addClass(province, 'unit-value-selected');
        else
          L.DomUtil.addClass(province, 'unit-value-hover');
      }
      L.DomUtil.addClass(province, 'unit-value');
      province.innerHTML = provinceConfig.provinceName;

      //   L.DomEvent.on(province, 'mouseenter', () => { //目前省级不需要省级切换
      //     this._appendCitys(provinceConfig.citys);
      //     let countiesConfig = this.getDefaultCounties(provinceConfig.citys);
      //     this._appendCounties(countiesConfig);
      //     let townsConfig = this.getDefaultTowns(countiesConfig);
      //     this._appendTowns(townsConfig);
      //     let nodes = this._provinceContainer.childNodes;
      //     for (let index = 0; index < nodes.length; index++) {
      //       const element = nodes[index];
      //       L.DomUtil.removeClass(element, 'unit-value-hover');
      //     }
      //     L.DomUtil.addClass(province, 'unit-value-hover')
      //   });

      L.DomEvent.on(province, 'click', () => {
        let nodes = this._provinceContainer.childNodes;
        for (let index = 0; index < nodes.length; index++) {
          const element = nodes[index];
          L.DomUtil.removeClass(element, 'unit-value-selected');
        }
        L.DomUtil.addClass(province, 'unit-value-selected')

        L.DomUtil.addClass(this._selectPanel, 'unshow');
        this.selectedValues = provinceConfig.tag;
        if (this.selectedValues.length > 0) {
          this._labelControl.innerHTML = this.selectedValues[this.selectedValues.length - 1].name;
        }
        if (this.selectedCallback)
          this.selectedCallback(this.selectedValues);
      }),
        this._provinceContainer.appendChild(province);
    });

    let citysConfig = this.getDefaultCitys();
    this._appendCitys(citysConfig);

    let countiesConfig = this.getDefaultCounties(citysConfig);
    this._appendCounties(countiesConfig);

    let townsConfig = this.getDefaultTowns(countiesConfig);
    this._appendTowns(townsConfig);

    this._selectPanel.appendChild(this._provinceContainer);
    this._selectPanel.appendChild(this._cityContainer);
    this._selectPanel.appendChild(this._countyContainer);
    this._selectPanel.appendChild(this._townContainer);
  },
  _bindingEvent() {
    L.DomEvent.on(this._touchControl, 'mouseenter', () => {
      L.DomUtil.removeClass(this._selectPanel, 'unshow');
      L.DomUtil.empty(this._selectPanel);
      this._loadSelectPanel();
    });

    L.DomEvent.on(this._touchControl, 'mouseleave', () => {
      L.DomUtil.addClass(this._selectPanel, 'unshow');
    });
  },
  /**
   * 创建label
   */
  _createLabel(label) {
    let labelDom = L.DomUtil.create('div', 'unit-label');
    let labelIcon = L.DomUtil.create('div', 'unit-label-icon');
    let labelValue = L.DomUtil.create('div', 'unit-label-value');
    labelValue.innerHTML = label;
    labelDom.appendChild(labelIcon);
    labelDom.appendChild(labelValue);
    return labelDom;
  },
  /**
   * 重新加入城市
   */
  _appendCitys: function (citysConfig) {
    L.DomUtil.empty(this._cityContainer);
    this._cityContainer.appendChild(this._cityLabel);
    citysConfig.forEach(cityConfig => {
      let city = L.DomUtil.create('div');
      if (this.selectedValues.length > 1 && this.selectedValues[1].name == cityConfig.cityName) {
        if (this.selectedValues.length == 2)
          L.DomUtil.addClass(city, 'unit-value-selected');
        else
          L.DomUtil.addClass(city, 'unit-value-hover');
      }
      L.DomUtil.addClass(city, 'unit-value');
      city.innerHTML = cityConfig.cityName;

      L.DomEvent.on(city, 'mouseenter', () => {
        this._appendCounties(cityConfig.counties);
        let townsConfig = this.getDefaultTowns(cityConfig.counties);
        this._appendTowns(townsConfig);
        let nodes = this._cityContainer.childNodes;
        for (let index = 0; index < nodes.length; index++) {
          const element = nodes[index];
          L.DomUtil.removeClass(element, 'unit-value-hover');
        }
        L.DomUtil.addClass(city, 'unit-value-hover')
      });

      L.DomEvent.on(city, 'click', () => {
        let nodes = this._cityContainer.childNodes;
        for (let index = 0; index < nodes.length; index++) {
          const element = nodes[index];
          L.DomUtil.removeClass(element, 'unit-value-selected');
        }
        L.DomUtil.addClass(city, 'unit-value-selected');
        L.DomUtil.addClass(this._selectPanel, 'unshow');
        this.selectedValues = cityConfig.tag;
        if (this.selectedValues.length > 0) {
          this._labelControl.innerHTML = this.selectedValues[this.selectedValues.length - 1].name;
        }
        if (this.selectedCallback)
          this.selectedCallback(this.selectedValues);
      });
      this._cityContainer.appendChild(city);
    });
  },
  /**
   * 重新加入县区
   * @param {县区} countiesConfig
   */
  _appendCounties: function (countiesConfig) {
    L.DomUtil.empty(this._countyContainer);
    this._countyContainer.appendChild(this._countyLabel);
    countiesConfig.forEach(countyConfig => {
      let county = L.DomUtil.create('div');
      if (this.selectedValues.length > 2 && this.selectedValues[2].name == countyConfig.countyName) {
        if (this.selectedValues.length == 3)
          L.DomUtil.addClass(county, 'unit-value-selected');
        else
          L.DomUtil.addClass(county, 'unit-value-hover');
      }
      L.DomUtil.addClass(county, 'unit-value');
      county.innerHTML = countyConfig.countyName;
      L.DomEvent.on(county, 'mouseenter', () => {
        this._appendTowns(countyConfig.towns);

        let nodes = this._countyContainer.childNodes;
        for (let index = 0; index < nodes.length; index++) {
          const element = nodes[index];
          L.DomUtil.removeClass(element, 'unit-value-hover');
        }
        L.DomUtil.addClass(county, 'unit-value-hover')

      });
      L.DomEvent.on(county, 'click', () => {
        let nodes = this._countyContainer.childNodes;
        for (let index = 0; index < nodes.length; index++) {
          const element = nodes[index];
          L.DomUtil.removeClass(element, 'unit-value-selected');
        }
        L.DomUtil.addClass(county, 'unit-value-selected');

        L.DomUtil.addClass(this._selectPanel, 'unshow');
        this.selectedValues = countyConfig.tag;
        if (this.selectedValues.length > 0) {
          this._labelControl.innerHTML = this.selectedValues[this.selectedValues.length - 1].name;
        }
        if (this.selectedCallback)
          this.selectedCallback(this.selectedValues);

      });
      this._countyContainer.appendChild(county);
    });
  },
  /**
   * 重新加入乡镇
   */
  _appendTowns: function (townsConfig) {
    L.DomUtil.empty(this._townContainer);
    this._townContainer.appendChild(this._townLabel);
    townsConfig.forEach(townConfig => {
      let town = L.DomUtil.create('div');
      if (this.selectedValues.length > 3 && this.selectedValues[3].name == townConfig.townName)
        L.DomUtil.addClass(town, 'unit-value-selected');

      L.DomUtil.addClass(town, 'unit-value');
      town.innerHTML = townConfig.townName;
      L.DomEvent.on(town, 'mouseenter', () => {
        let nodes = this._townContainer.childNodes;
        for (let index = 0; index < nodes.length; index++) {
          const element = nodes[index];
          L.DomUtil.removeClass(element, 'unit-value-hover');
        }
        L.DomUtil.addClass(town, 'unit-value-hover')
      });

      L.DomEvent.on(town, 'click', () => {
        let nodes = this._townContainer.childNodes;
        for (let index = 0; index < nodes.length; index++) {
          const element = nodes[index];
          L.DomUtil.removeClass(element, 'unit-value-selected');
        }
        L.DomUtil.addClass(town, 'unit-value-selected');

        L.DomUtil.addClass(this._selectPanel, 'unshow');
        this.selectedValues = townConfig.tag;
        if (this.selectedValues.length > 0) {
          this._labelControl.innerHTML = this.selectedValues[this.selectedValues.length - 1].name;
        }
        if (this.selectedCallback)
          this.selectedCallback(this.selectedValues);
      });
      this._townContainer.appendChild(town);
    })
  },
  /**
   * 获取默认的城市名称，优先已选省的城市，否则取第一个省的城市
   */
  getDefaultCitys: function () {
    if (this.selectedValues.length > 0 && this.selectedValues[0]) {
      for (let index = 0; index < this.districtData.length; index++) {
        const province = this.districtData[index];
        if (province.provinceName == this.selectedValues[0].name) {
          return province.citys;
        }
      }
    }
    if (this.districtData.length > 0)
      return this.districtData[0].citys;
  },
  /**
   * 获取默认的县区名称，优先已选城市的县区，否则取第一个城市的县区
   */
  getDefaultCounties: function (citys) {
    if (this.selectedValues.length > 1 && this.selectedValues[1]) {
      for (let index = 0; index < citys.length; index++) {
        const city = citys[index];
        if (city.cityName == this.selectedValues[1].name) {
          return city.counties;
        }
      }
    }
    if (citys.length > 0)
      return citys[0].counties;
  },
  /**
   * 获取默认的乡镇名称，优先已选县区的乡镇，否则取第一个县区的乡镇
   */
  getDefaultTowns: function (counties) {
    if (this.selectedValues.length > 2 && this.selectedValues[2]) {
      for (let index = 0; index < counties.length; index++) {
        const county = counties[index];

        if (county.countyName == this.selectedValues[2].name) {
          return county.towns;
        }
      }
    }
    if (counties.length > 0)
      return counties[0].towns;
  },
  addTagInfo: function (districtconfig) {
    districtconfig.forEach(province => {
      province.tag = [{
        name: province.provinceName,
        code: province.provinceCode
      }];
      province.citys.forEach(city => {
        city.tag = [{
          name: province.provinceName,
          code: province.provinceCode
        }, {
          name: city.cityName,
          code: city.cityCode
        }];
        city.counties.forEach(county => {
          county.tag = [{
            name: province.provinceName,
            code: province.provinceCode
          }, {
            name: city.cityName,
            code: city.cityCode
          }, {
            name: county.countyName,
            code: county.countyCode
          }];
          county.towns.forEach(town => {
            town.tag = [{
              name: province.provinceName,
              code: province.provinceCode
            }, {
              name: city.cityName,
              code: city.cityCode
            }, {
              name: county.countyName,
              code: county.countyCode
            }, {
              name: town.townName,
              code: town.townCode
            }];
          })
        })
      })
    });
  }
});

/**
 * 初始化，data包含省市县乡四级
 */
L.Control.districtControl = function (data, selectedValues, options, selectedCallback) {
  return new L.Control.DistrictControl(data, selectedValues, options, selectedCallback);
}

export default L;
