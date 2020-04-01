<!--资源管理-->
<template>
  <div class="setting-menu-container" v-bind:style="{'width':pageWidth+'px','height':pageHeight+'px'}">
    <div class="search-container">
      <div class="search-button" style="margin-right: 30px">
        <Button @click="onRootAdd" icon="plus-round" type="primary">新增</Button>
      </div>
      <div class="search-button">
        <Button @click="onDoSearch" icon="ios-search" type="primary">查询</Button>
      </div>
      <div class="search-item">
        <div class="search-item-label">
          菜单名称:
        </div>
        <div class="search-item-condition">
          <Input v-model="searchName" style="width:200px" placeholder=""></Input>
        </div>
      </div>
    </div>
    <div class="menu-content-container">
      <div class="table-container" v-bind:style="{'height':(pageHeight-50)+'px','width':(tableContainerWidth-35)+'px'}">
        <VuePerfectScrollbar v-bind:style="{'width':(tableContainerWidth-35)+'px', 'height': (pageHeight-80) + 'px'}"
                             ref="ps"
                             :settings="settings">
          <tree-grid
            :items='data'
            :columns='columns'
            :format='this.dataFormat'
            :tableWidth="(tableContainerWidth-35)"
            :tableHeight="(pageHeight-80)"
          ></tree-grid>
        </VuePerfectScrollbar>
      </div>
      <div v-show="editShow" class="menu-item-container"
           v-bind:style="{'height':(pageHeight-50)+'px','width':(pageWidth-tableContainerWidth)+'px'}">
        <VuePerfectScrollbar v-bind:style="{'height':(pageHeight-50)+'px','width':(pageWidth-tableContainerWidth)+'px'}"
                             ref="edit-ps"
                             :settings="settings">
        <Form ref="menuForm" :model="currentItem" :rules="ruleValidate" :label-width="80">
          <FormItem label="菜单名称" prop="menuName">
            <Input v-model="currentItem.menuName" placeholder="请输入菜单名称"></Input>
          </FormItem>
          <FormItem label="链接地址" prop="menuUrl">
            <Input v-model="currentItem.menuUrl" placeholder="请输入链接地址"></Input>
          </FormItem>
          <FormItem label="前端路由" prop="menuRoute">
            <Input v-model="currentItem.menuRoute" placeholder="前端路由地址"></Input>
          </FormItem>
          <FormItem label="菜单图标" prop="menuIcon">
            <Input v-model="currentItem.menuIcon" placeholder="请输入菜单图标">
            <Button @click="onShowIcons" slot="append" icon="ios-search"></Button>
            </Input>
          </FormItem>
          <FormItem label="所属模块" prop="modelName">
            <Input v-model="currentItem.modelName" placeholder="请输入模块名称"></Input>
          </FormItem>
          <FormItem label="分割权限" prop="split">
            <i-switch v-model="currentItem.split" size="large">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
          </FormItem>
          <FormItem v-if="currentItem.split" label="分割键名" prop="flagKey">
            <Input v-model="currentItem.flagKey" placeholder="请输入分割键名"></Input>
          </FormItem>
          <FormItem v-if="currentItem.split" label="分割键值" prop="flag">
            <Input v-model="currentItem.flag" placeholder="请输入分割键值"></Input>
          </FormItem>
          <FormItem label="权限标识" prop="permission">
            <Input v-model="currentItem.permission" placeholder="请输入权限标识"></Input>
          </FormItem>
          <FormItem label="排序号" prop="sort">
            <InputNumber :min="0" v-model="currentItem.sort"
                         v-bind:style="{'width':(pageWidth-tableContainerWidth-85)+'px'}"></InputNumber>
          </FormItem>
          <FormItem label="菜单类型" prop="menuType">
            <Select v-model="currentItem.menuType" placeholder="选择菜单类型">
              <Option value="API">接口</Option>
              <Option value="MENU">菜单</Option>
              <Option value="BUTTON">按钮</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Button @click="onSubmit" type="primary" style="float: right">保存</Button>
            <Button @click="cancelEdit" type="ghost" style="float: right;margin-right: 10px">取消</Button>
          </FormItem>
        </Form>
        </VuePerfectScrollbar>
      </div>
    </div>

    <Modal width="600" v-model="iconModel">
      <p slot="header">
        <span>请选择图标</span>
      </p>
      <div style="min-height: 200px;max-height: 400px;overflow: auto">
        <div>
           not support now
        </div>
      </div>
      <div slot="footer">
        <Button @click="iconModel=false;selectIcon = null">取消</Button>
        <Button @click="onIconSelected" type="primary">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import TreeGrid from '.././../../components/TreeGrid';
  import VuePerfectScrollbar from 'vue-perfect-scrollbar'

  export default {
    name: "resource-setting",
    props: {
      pageHeight: Number,
      pageWidth: Number
    },
    data() {
      return {
        columns: [
          {
            title: '菜单名称',
            key: 'menuName',
            width: '150',
          },
          {
            title: '所属模块',
            key: 'modelName',
            width: '150',
          },
          {
            title: '菜单类型',
            key: 'menuType',
            width: '150'
          },
          {
            title: '排序号',
            key: 'sort',
            width: '150',
          },
          {
            title: '操作',
            type: 'action',
            actions: [{
              type: 'md-hammer',
              text: '编辑',
              fun: this.onItemEdit
            }, {
              type: 'ios-trash',
              text: '删除',
              fun: this.onItemDel
            }, {
              type: 'md-add-circle',
              text: '新增',
              fun: this.onItemAdd
            }
            ],
            width: '150',
          }],
        data: [],
        settings: {//滚动条设置
          maxScrollbarLength: 60,
        },
        tableContainerWidth: this.pageWidth,
        editShow: false,
        isAdd: false,
        currentItem: {
          id: "",
          parentId: "",
          sort: 0,
          menuName: "",
          menuUrl: "",
          menuRoute: "",
          menuIcon: "",
          menuType: "",
          modelName: "",
          permission: "",
          createTime: "",
          createUserId: "",
          split:false,
          flag:"",
          flagKey:"",
          children: []
        },
        searchName: "",
        ruleValidate: {
          menuName: [
            {required: true, message: '名称不能为空', trigger: 'blur'}
          ]
        },
        iconModel:false,
        selectIcon:null,
        iconList:[
        ]
      }
    },
    watch: {
      pageWidth: function (val) {
        if (this.editShow) {
          this.tableContainerWidth = val / 2;
        } else {
          this.tableContainerWidth = val;
        }
      }
    },
    components: {
      TreeGrid,
      VuePerfectScrollbar
    },
    methods: {
      onItemAdd:function(result, event, index){
        this.currentItem = {
          id: "",
          parentId: -1,
          sort: 0,
          menuName: "",
          menuUrl: "",
          menuRoute: "",
          menuIcon: "",
          menuType: "",
          modelName: "",
          permission: "",
          createTime: "",
          updateTime: "",
          createUserId: "",
          updateUserId: "",
          split:false,
          flag:"",
          flagKey:"",
          children: []
        };
        this.currentItem.parentId = result.id;
        this.currentItem.modelName = result.modelName;
        this.tableContainerWidth = this.pageWidth / 2;
        this.editShow = true;
        this.isAdd = true;
      },
      onItemDel:function(result, event, index){
        this.$Modal.confirm({
          title: '删除',
          content: '<p>确认要删除该菜单及所有子菜单吗？</p>',
          onOk: () => {
            var params = new FormData();
            params.append('menuId', result.id);
            let that = this;
            this.$ajax.post(this.$api.MenuDelete, params, this).then((data) => {
              if (data.success) {
                this.data = data.data;
                this.cancelEdit();
              } else {
                that.$Message.error(data.message);
              }
            });
          },
          onCancel: () => {
          }
        });
      },
      onItemEdit:function(result, event, index){
        this.currentItem = result;
        this.tableContainerWidth = this.pageWidth / 2;
        this.editShow = true;
        this.isAdd = false;
        this.currentItem.menuType = this.getMenuTypeValue(result.menuType);
      },
      onIconSelected:function(){

      },
      onShowIcons:function(){
        this.iconModel = true;
      },
      onSubmit: function () {
        this.$refs.menuForm.validate((valid) => {
          if (valid) {
            this.onPostData();
          }
        });
      },
      getMenuTypeValue: function (type) {
        switch (type) {
          case "接口":
            return "API";
          case "菜单":
            return "MENU";
          case "按钮":
            return "BUTTON";
        }
      },
      onPostData: function () {
        if (this.isAdd) {
          var params = new FormData();
          params.append('parentId', this.currentItem.parentId);
          params.append('sort', this.currentItem.sort);
          params.append('menuName', this.currentItem.menuName);
          params.append('menuUrl', this.currentItem.menuUrl);
          params.append('menuRoute', this.currentItem.menuRoute);
          params.append('menuIcon', this.currentItem.menuIcon);
          params.append('menuType', this.currentItem.menuType);
          params.append('modelName', this.currentItem.modelName);
          params.append('permission', this.currentItem.permission);
          params.append('split', this.currentItem.split);
          params.append('flag', this.currentItem.flag);
          params.append('flagKey', this.currentItem.flagKey);
          let that = this;
          this.$ajax.post(this.$api.MenuAdd, params, this).then((data) => {
            if (data.success) {
              this.data = data.data;
              this.cancelEdit();
            } else {
              that.$Message.error(data.message);
            }
          });
        }else{
          var params = new FormData();
          params.append('id', this.currentItem.id);
          params.append('parentId', this.currentItem.parentId);
          params.append('sort', this.currentItem.sort);
          params.append('menuName', this.currentItem.menuName);
          params.append('menuUrl', this.currentItem.menuUrl);
          params.append('menuRoute', this.currentItem.menuRoute);
          params.append('menuIcon', this.currentItem.menuIcon);
          params.append('menuType', this.currentItem.menuType);
          params.append('modelName', this.currentItem.modelName);
          params.append('permission', this.currentItem.permission);
          params.append('split', this.currentItem.split);
          params.append('flag', this.currentItem.flag);
          params.append('flagKey', this.currentItem.flagKey);
          params.append('createUserId', this.currentItem.createUserId);
          let that = this;
          this.$ajax.post(this.$api.MenuEdit, params, this).then((data) => {
            if (data.success) {
              this.data = data.data;
              this.cancelEdit();
            } else {
              that.$Message.error(data.message);
            }
          });
        }
      },
      cancelEdit: function () {
        this.tableContainerWidth = this.pageWidth;
        this.editShow = false;
        this.isAdd = false;
      },
      onRootAdd: function () {
        this.tableContainerWidth = this.pageWidth / 2;
        this.editShow = true;
        this.isAdd = true;
        this.currentItem = {
          id: "",
          parentId: -1,
          sort: 0,
          menuName: "",
          menuUrl: "",
          menuRoute: "",
          menuIcon: "",
          menuType: "",
          modelName: "",
          permission: "",
          createTime: "",
          updateTime: "",
          createUserId: "",
          updateUserId: "",
          split:false,
          flag:"",
          flagKey:"",
          children: []
        };
      },
      onDoSearch: function () {
        var params = new FormData();
        params.append('name', this.searchName);
        let that = this;
        this.$ajax.post(this.$api.MenuQuery, params, this).then((data) => {
          if (data.success) {
            this.data = data.data;
            this.cancelEdit();
          } else {
            that.$Message.error(data.message);
          }
        });
      },
      dataFormat: function (item) {
        switch (item.menuType) {
          case "API":
            item.menuType = '接口';
            break;
          case "MENU":
            item.menuType = '菜单';
            break;
          case "BUTTON":
            item.menuType = '按钮';
            break;
          default:
            break;
        }
        return item;
      },
      loadData:function(){
        this.$ajax.post(this.$api.MenuQueryAll, null, this).then((data) => {
          if (data.success) {
            this.data = data.data;
          }
        });
      }
    },
    mounted() {
      this.$parent.activeMenu("resource");
      this.loadData();
    }
  }

</script>
