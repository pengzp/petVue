<!--系统设置页面-->
<template>
  <div class="setting-container" v-bind:style="{'width':contentWidth+'px','height':contentHeight+'px'}">
    <div class="setting-header">
      <div class="header-logo">
        <img src="/static/images/logo-ico.png">
      </div>
      <div class="header-title">
        宠爱后台管理平台
      </div>
      <div @click="back" class="header-back">
        <Tooltip content="返回" placement="bottom">
          <Icon size="26" type="md-return-left"></Icon>
        </Tooltip>
      </div>
    </div>
    <div style="position: fixed" v-bind:style="{'width':contentWidth+'px','height':(contentHeight-50)+'px'}">
      <div class="menu-container">
        <!--<div class="setting-title">-->
          <!--系统配置-->
        <!--</div>-->
        <Menu @on-select="showMenuContent" style="width: 230px;" v-bind:style="{'height':(contentHeight-50)+'px'}"
              theme="light" :active-name="menu">

          <MenuItem v-for="(menu,index) in menus" :key="index" :name="menu.permission">
            <i :class="menu.menuIcon" aria-hidden="true"></i>
            {{menu.menuName}}
          </MenuItem>
        </Menu>
      </div>
      <div class="content-container" v-bind:style="{'width':(contentWidth-230)+'px','height':(contentHeight-50)+'px'}">
        <router-view :pageWidth="(contentWidth-230)" :pageHeight="(contentHeight-50)"></router-view>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'setting',
    props: {
      contentHeight: Number,
      contentWidth: Number
    },
    components: {
    },
    data() {
      return {
        menu: '',
        settingMenus: this.$store.state.User.user.menus.systemSetting
      }
    },
    computed: {
      menus: function () {
        if (this.settingMenus == null)
          return [];
        if (!Array.isArray(this.settingMenus) && this.settingMenus.parentId == -1) {
          return this.settingMenus.children;
        } else {
          if (this.settingMenus && this.settingMenus[0]) {
            let menus = this.settingMenus[0];
            if (menus.parentId == -1) {
              return menus.children;
            }
          }
          return this.settingMenus;
        }
      }
    },
    methods: {
      showMenuContent: function (name) {
        var menu = this.getMenu(name);
        if(menu!=null){
          this.$router.push({path: menu.menuRoute});
        }
      },
      activeMenu: function (menu) {
        this.menu = menu;
      },
      getMenu:function (name) {
        for(var i=0; i < this.menus.length; i++){
          var menu = this.menus[i];
          if(menu.permission == name){
            return menu;
          }
        }
      },
      back:function () {
        this.$router.push({path: "/admin"});
      }
    },
    mounted() {

    }
  }
</script>
