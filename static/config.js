window.ApplicationConfig = {
  baseUrl: 'http://localhost:9003/ecology',
  // baseUrl: 'http://60.191.110.203:9023/ecology',
  socketEndpoint: '/socket',
  tokenKey: 'Authorization',
  tokenPrefix: 'zjugis-',
  loginCheck: true,
  loginUrl: '/#',
 
  
  layerGroups: [
    {
      name: "基础数据",
      index: 0,
      open: true,
      layers: [
        {
          name: "行政区",
          index: 0,
          url: "http://47.110.13.171:6080/arcgis/rest/services/fx/320321_xzq/MapServer",
          visible: true,
          type: 'dynamic',
          opacity:100
        }
      ]
    },
    {
      name: "生态修复项目",
      index: 1,
      open: true,
      layers: [
        {
          name: "土地整治项目",
          index: 0,
          url: "http://47.110.13.171:6080/arcgis/rest/services/fx/320321_tdzzxm/MapServer",
          visible: true,
          type: 'dynamic',
          key:'tdzz',
          opacity:100,
        },
        {
          name: "增减挂钩项目",
          index: 1,
          url: "http://47.110.13.171:6080/arcgis/rest/services/fx/30321_zjggxm/MapServer",
          visible: true,
          type: 'dynamic',
          key:'zjgg',
          opacity:100,
        },
        {
          name:"规划设计",
          index: 2,
          url: "",
          visible: true,
          type: 'dynamic',
          key:'zjgg',
          opacity:100,
          open:true,
          layers:[
            {
              name:"旱改水规划设计",
              index: 2,
              url: "http://47.110.13.171:6080/arcgis/rest/services/fx/hgsgh/MapServer",
              visible: true,
              type: 'dynamic',
              opacity:100,
              key:'zjgg',
            }
          ]
        }
      ]
    },
    {
      name: "现状数据",
      index: 2,
      open: true,
      layers: [
        {
          name: "土地利用现状",
          index: 0,
          url: "http://47.110.13.171:6080/arcgis/rest/services/fx/320321_tdlyxz/MapServer",
          visible: false,
          type: 'title',
          opacity:100
        }
      ]
    },
    {
      name: "规划数据",
      index: 3,
      open: true,
      layers: [
        {
          name: "土地用途区",
          index: 0,
          url: "http://47.110.13.171:6080/arcgis/rest/services/fx/320321_TDYTQ/MapServer",
          visible: false,
          type: 'title',
          opacity:100
        },
        {
          name: "建设用地管制区",
          index: 1,
          url: "http://47.110.13.171:6080/arcgis/rest/services/fx/320321_JSYDGZQ/MapServer",
          visible: false,
          type: 'title',
          opacity:100
        }
      ]
    }
  ],
  identifyLayer:{
    tdzz:{
      url:'http://47.110.13.171:6080/arcgis/rest/services/fx/320321_tdzzxm/MapServer'
    },
    zjgg:{
      url:'http://47.110.13.171:6080/arcgis/rest/services/fx/30321_zjggxm/MapServer'
    },
    village:{
      url:'http://47.110.13.171:6080/arcgis/rest/services/fx/320321_village/MapServer'
    },
    cb:{
      url:'http://47.110.13.171:6080/arcgis/rest/services/fx/320321_cb/MapServer'
    }
  },
  
  //时间配置
  yearList:[
    {
      value:'2020',
      label:'2020'
    },
    {
      value:'2019',
      label:'2019'
    },
    {
      value:'2018',
      label:'2018'
    },
    {
      value: '2017',
      label: '2017',
    },
    {
      value: '2016',
      label: '2016',
    },
    {
      value: '2015',
      label: '2015',
    },
    {
      value: '2014',
      label: '2014',
    },
    {
      value: '2013',
      label: '2013',
    },
    {
      value: '2012',
      label: '2012',
    },
    {
      value: '2011',
      label: '2011',
    },
    {
      value: '2010',
      label: '2010',
    },
    {
      value: '2009',
      label: '2009',
    },
    {
      value: '2008',
      label: '2008',
    },
    {
      value: '2007',
      label: '2007',
    },
    {
      value: '2006',
      label: '2006',
    },
    {
      value: '2005',
      label: '2005',
    },
    {
      value: '2004',
      label: '2004',
    },
    {
      value: '2003',
      label: '2003',
    },
    {
      value: '2002',
      label: '2002',
    },
    {
      value: '2001',
      label: '2001',
    },
    {
      value: '2000',
      label: '2000',
    },
  ],
  projectSteps:[
    '立','复','验'
  ],
  projectTypeName:{
    'reclaim':'城乡建设用地增减挂钩项目',
    'balance':'占补平衡项目',
    'farm':'万顷良田项目',
    'mine':"矿山修复项目",
  },
  /*耕地质量等别*/
  arableLandLevels:[
    {value:"1",label:"一等"},
    {value:"2",label:"二等"},
    {value:"3",label:"三等"},
    {value:"4",label:"四等"},
    {value:"5",label:"五等"},
    {value:"6",label:"六等"},
    {value:"7",label:"七等"},
    {value:"8",label:"八等"},
    {value:"9",label:"九等"},
    {value:"10",label:"十等"},
    {value:"11",label:"十一等"},
    {value:"12",label:"十二等"},
    {value:"13",label:"十三等"},
    {value:"14",label:"十四等"},
    {value:"15",label:"十五等"}
  ],
  exameDictCode:'PROJECT_STATUS',
  reportExameName:'立项审批',
  crs: {//非经纬度坐标需要设置空间参考
    isWGS84: true,
    name: "EPSG:4527",
    //desc: "+proj=tmerc +lat_0=0 +lon_0=120 +k=1 +x_0=40500000 +y_0=0 +a=6378140 +b=6356755.288157528 +units=m +no_defs ",
    desc: "+proj=tmerc +lat_0=0 +lon_0=117 +k=1 +x_0=39500000 +y_0=0 +ellps=GRS80 +units=m +no_defs ",
    resolutions: [
      132.2919312505292,
      66.1459656252646,
      33.0729828126323,
      16.933367200067735,
      8.466683600033868,
      4.233341800016934,
      2.116670900008467,
      1.0583354500042335,
      0.5291677250021167,
      0.26458386250105836
     ],
    origin: [3.38768E7 ,1.00021E7 ],
    bounds:[
      3.944093486365237E7,
      3808500.9269947913,
      3.94879217254276E7,
      3868191.034596853
    ]
  },
  mapConfig: {
    center: [34.7014222, 116.5855188],
    zoom:1
  }
};






