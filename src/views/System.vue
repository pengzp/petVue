<!--主页-->
<template>
  <div class="system-container" v-bind:style="{'width':contentWidth+'px','height':contentHeight+'px'}">
    <Header  :title="title" :activeBar="currentPage"></Header>
    <div class="center-container" v-bind:style="{'width':(contentWidth-sidebarWidth)+'px','height':(contentHeight-65)+'px'}">
      <router-view :contentWidth="(contentWidth)" :contentHeight="(contentHeight-65)"></router-view>
    </div>
  </div>
</template>
<script>
 import Header from './components/Header'

  export default {
    name: 'System',
    props: {
      contentHeight: Number,
      contentWidth: Number
    },
    data() {
      return {
        currentPage: "",
        sidebarWidth: 0,
        title:""
      }
    },
    components: {
      Header
    },
    methods: {
      afterPageChange: function (key) {
        this.currentPage = key;
      },
    },
    mounted() {
    }
  }
</script>
