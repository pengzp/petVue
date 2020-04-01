<template>
  <div class="feature-info-box">
    <div class="title">
      {{title}}
    </div>
    <div class="info-table">
      <div v-for="count in rowNums" class="info-row" :class="{'no-border': count === rowNums, }">
        <div :span="4" class="info-col prop-title" :title="safeGetTitle(count-1)">
          {{safeGetTitle(count-1)}}
        </div>
        <div :span="8" class="info-col prop-value" :title="safeGetValue(count-1)">
          {{safeGetValue(count-1)}}
        </div>
        <div :span="4" class="info-col prop-title"
             :title="safeGetTitle(count + rowNums -1)">
          {{safeGetTitle(count + rowNums -1)}}
        </div>
        <div :span="8" class="info-col no-border prop-value"
             :title="safeGetValue(count + rowNums -1)">
          {{safeGetValue(count + rowNums -1)}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "PopInfoWindow",
    props: {
      title: {
        type: String
      },
      properties: {
        type: Object
      }
    },
    computed: {
      rowNums: function () {
        let prosLength = Object.keys(this.properties).length;
        return Math.ceil(prosLength / 2);
      },
      propsEntries: function () {
        return Object.entries(this.properties);
      },
    },
    methods: {
      safeGetTitle(index) {
        let temp = this.propsEntries[index];
        if (temp) {
          return temp[0];
        }
        return '';
      },
      safeGetValue(index) {
        let temp = this.propsEntries[index];
        if (temp) {
          return temp[1];
        }
        return '';
      }
    }
  }
</script>

<style scoped lang="scss">

  $--border-color: #7f9bce;

  .text-overflow-hidden {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .feature-info-box {

    .title {
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 10px;
      color: #7a5cec;
    }

    .info-table {
      border: solid 1px $--border-color;
      border-radius: 2px;

      .info-row {
        border-bottom: solid 1px $--border-color;
        display: flex;
        flex-direction: row;
        height: 33px;
        line-height: 32px;

        .prop-title {
          @extend .text-overflow-hidden;
          width: 15%;
          text-align: center;
          color: #6188ce;
        }

        .prop-value {
          @extend .text-overflow-hidden;
          width: 35%;
           font-weight: bold;
        }
      }

      .info-col {
        border-right: solid 1px $--border-color;
        padding: 0px 5px;
      }

      .no-border {
        border: none;
      }
    }
  }


</style>
