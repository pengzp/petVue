<template>
  <div class="main-container" :style="{width:contentWidth+'px',height:contentHeight+'px'}">
      <div class="header-logo">
        <div class="login-icon">
          <i class="iconfont icon-yonghu-copy"></i>
        </div>
        <img :src="'static/images/header/name-logo.png'">
        <div class="login-icon">
          <i class="iconfont icon-tuichu4"></i>
        </div>
      </div>
      <div class="menu-form" :style="{width:contentWidth+'px',top:(contentHeight-180-40)/2+'px','padding':0 +'px '+ formMargin +'px'}">
        <div class="form-item"  :style="{}" v-for="(menu,index)  in menus" :key="index">
          <router-link v-if="menu.type == 'path'" :to="{path: menu.children!==undefined && menu.children!==null && menu.children[0].url!==undefined ? menu.children[0].url : menu.url,query:{key: menu.key, title: menu.menuName}}"  target="_blank"  >
            <div  class="icon" >
              <div  class="icon-inner" :class="'icon-'+index" >
                <i class="iconfont " :class="'icon-'+menu.iconfont"></i>
              </div>
            </div>
            <div class="label">{{menu.menuName}}</div>
          </router-link>
    
         
        </div>
      </div>
  </div>
</template>
<script>

  export default {
    props: {
      contentHeight: Number,
      contentWidth: Number
    },
    name: 'main',
    data() {
      return {
        formMargin:100,
        menus: window.ApplicationConfig.menus,
        activeIndex:-1,
      }
    },
    methods: {
      openBlank(menu){
        if(menu.children != undefined){
          window.open(menu.children[0].url, "_blank");
        }
      },
    },
    mounted() {
      this.formMargin = (this.contentWidth-(230+50)*this.menus.length)/2
      //this.formMargin = (this.contentWidth-100*this.menus.length)/(this.menus.length+1)
    }
  }
</script>
