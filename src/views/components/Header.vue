<template>
  <div class="header-container">
    <div class="header-logo">
      <img src="static/images/header/name-logo.png">
    </div>
    <div class="navs-item">
      <div class="items">
        <ul class="">
          <div class="nav-item" v-for="menu in menus"  v-bind:class="{'selected': activeKey==menu.key}" :key="menu.key">
            <li v-if="menu.type =='path'">
              <router-link  :to="menu.url">
                <div class="item-cont">
                  <div class="item-cont-img">
                    <img :src="'static/images/header/'+menu.icon"/>
                  </div>
                  <div class="item-cont-text">
                    {{menu.menuName}}
                  </div>
                </div>
              </router-link>
            </li>
            <li v-else>
              <a :href="menu.url" target="_blank">
                <div class="item-cont">
                  <div class="item-cont-img">
                    <img :src="'static/images/header/'+menu.icon"/>
                  </div>
                  <div class="item-cont-text">
                    {{menu.menuName}}
                  </div>
                </div>
              </a>
            </li>
          </div>
        </ul>
      </div>
     
      <div class="user-info">
          <div class="user-text"  style="margin: 0 10px;" >
            <i class="iconfont icon-yonghu-copy"></i>
            管理员
          </div>
          <div class="exit">
              <i class="iconfont icon_down_arrow"></i>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
   import TokenUtil from '../../utils/TokenUtil'
  export default {
    name: 'app-header',
    props: {
      canMiniBar: true,
      title:'',
      activeBar: String
    },
    components:{
    },
    data() {
      return {
        isFullScreen: false,
        activeKey: this.activeBar,
        menus: window.ApplicationConfig.menus,
        resetModal: false,
      }
    },
    watch: {
      activeBar: function (val) {
        this.activeKey = val;
      }
    },
    methods: {
      logout: function () {
        this.$router.push({path: '/login'});
      },
      openBlank(name){
      },
    }
  }
</script>
