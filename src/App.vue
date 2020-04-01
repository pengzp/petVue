<template>
  <div id="app">
    <router-view v-bind:style="{'width':pageWidth+'px','height':pageHeight+'px'}" :contentWidth="pageWidth" :contentHeight="pageHeight" />
  </div>
</template>

<script>
  import StoreUtil from './utils/StoreUtil'
export default {
  name: 'App',
  data() {
    return {
      pageHeight: document.documentElement.clientHeight, //页面高度
      pageWidth: document.documentElement.clientWidth, //页面宽度
    }
  },
  mounted() {
    this.pageHeight = document.documentElement.clientHeight;
    this.pageWidth = document.documentElement.clientWidth;
    const that = this;
    window.onresize = function temp() {
      that.pageHeight = document.documentElement.clientHeight;
      that.pageWidth = document.documentElement.clientWidth;
    }
    StoreUtil.init(this)
  }
}
</script>

<style lang='scss'>

  @import "assets/scss/app.scss";

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
