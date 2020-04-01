<!--角色管理-->
<template>
  <div class="setting-role-container">
    <div class="search-container">
      <div class="search-button" style="margin-right: 30px">
        <Button @click="onRootAdd" icon="plus-round" type="primary">新增</Button>
      </div>
      <div class="search-button">
        <Button @click="onDoSearch" icon="ios-search" type="primary">查询</Button>
      </div>
      <div class="search-item">
        <div class="search-item-label">
          角色代码:
        </div>
        <div class="search-item-condition">
          <Input v-model="searchCode" style="width:200px" placeholder=""></Input>
        </div>
      </div>
      <div class="search-item">
        <div class="search-item-label">
          角色名称:
        </div>
        <div class="search-item-condition">
          <Input v-model="searchName" style="width:200px" placeholder=""></Input>
        </div>
      </div>
    </div>
    <div class="role-content-container">
      <div class="table-container" v-bind:style="{'height':(pageHeight-50)+'px','width':(pageWidth-35)+'px'}">
        <VuePerfectScrollbar v-bind:style="{'width':(pageWidth-35)+'px', 'height': (pageHeight-80) + 'px'}"
                             ref="ps"
                             :settings="settings">
          <tree-grid
            :items='data'
            :columns='columns'
            :format='this.dataFormat'
            :tableWidth="(pageWidth-35)"
            :tableHeight="(pageHeight-80)"
          ></tree-grid>
        </VuePerfectScrollbar>
      </div>

    </div>

    <Modal width="600" v-model="roleModel">
      <p slot="header">
        <span>{{modelTitle}}</span>
      </p>
      <div>
        <Form ref="roleForm" :model="roleData" :rules="roleValidate" :label-width="80">
          <FormItem label="角色名称" prop="roleName">
            <Input v-model="roleData.roleName" placeholder="请输入角色名称"></Input>
          </FormItem>
          <FormItem label="角色代码" prop="roleCode">
            <Input v-model="roleData.roleCode" placeholder="角色代码(大写英文字母)"></Input>
          </FormItem>
          <FormItem label="角色类型" prop="roleType">
            <Select v-model="roleData.roleType" placeholder="请选择角色类型">
              <Option value="USER">普通用户</Option>
              <Option value="ADMIN">管理员</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="onEditCancel">取消</Button>
        <Button @click="onSubmit" type="primary">确定</Button>
      </div>
    </Modal>

    <Modal width="300" v-model="powerModel">
      <p slot="header">
        <span>角色授权</span>
      </p>
      <div style="min-height: 200px;max-height: 400px;overflow: auto">
        <Tree ref="granTree" @on-check-change="granTreeChange" :data="treeData" show-checkbox></Tree>
      </div>
      <div slot="footer">
        <Button @click="powerModel = false;grantNodes=null;currentItem=null">取消</Button>
        <Button @click="onRoleGrantNew" type="primary">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import TreeGrid from '.././../../components/TreeGrid';
  import VuePerfectScrollbar from 'vue-perfect-scrollbar'
  import dataUtil from '../../../utils/DataUtil'

  export default {
    name: "role-setting",
    props: {
      pageHeight: Number,
      pageWidth: Number
    },
    components: {
      TreeGrid,
      VuePerfectScrollbar
    },
    data() {
      return {
        searchCode: '',
        searchName: '',
        settings: {//滚动条设置
          maxScrollbarLength: 60,
        },
        data: [],
        columns: [
          {
            title: '角色名称',
            key: 'roleName',
            width: '150',
          },
          {
            title: '角色代码',
            key: 'roleCode',
            width: '150',
          },
          {
            title: '角色类型',
            key: 'roleType',
            width: '150'
          },
          {
            title: '操作',
            type: 'action',
            actions: [{
              type: 'ios-build',
              text: '编辑',
              fun: this.onItemEdit
            }, {
              type: 'ios-trash',
              text: '删除',
              fun: this.onItemDel
            }, {
              type: 'ios-bulb',
              text: '授权',
              fun: this.onGrant
            }
            ],
            width: '150',
          }],
        roleModel: false,
        modelTitle: "新增角色",
        roleData: {
          id: null,
          roleName: "",
          roleCode: "",
          roleType: null
        },
        roleValidate: {
          roleName: [
            {required: true, message: '角色名称不能为空', trigger: 'blur'}
          ],
          roleCode: [
            {required: true, message: '角色代码不能为空', trigger: 'blur'}
          ],
          roleType: [
            {required: true, message: '请选择角色类型', trigger: 'change'}
          ]
        },
        powerModel: false,
        treeData: [],
        grantNodes: null,
        currentItem:null
      }
    },
    methods: {
      onEditCancel: function () {
        this.roleModel = false;
        this.$refs.roleForm.resetFields();
      },
      onSubmit: function () {
        this.$refs.roleForm.validate((valid) => {
          if (valid && this.roleData.roleType != null) {
            this.onPostData();
          }
        });
      },
      onPostData: function () {
        var params = new FormData();
        params.append('roleName', this.roleData.roleName);
        if (this.roleData.roleType == "ADMIN") {
          let code = this.roleData.roleCode;
          let array = this.roleData.roleCode.split("ROLE_ADMIN_");
          if (array.length > 1) {
            code = array[1];
          } else {
            code = array[0];
          }
          params.append('roleCode', "ROLE_ADMIN_" + code.toLocaleUpperCase());
        } else if (this.roleData.roleType == "USER") {
          let code = this.roleData.roleCode;
          let array = this.roleData.roleCode.split("ROLE_USER_");
          if (array.length > 1) {
            code = array[1];
          } else {
            code = array[0];
          }
          params.append('roleCode', "ROLE_USER_" + code.toLocaleUpperCase());
        }
        params.append('roleType', this.roleData.roleType);

        let that = this;
        if (this.roleData.id) {
          params.append('id', this.roleData.id);
          this.$ajax.post(this.$api.RoleEdit, params, this).then((data) => {
            if (data.success) {
              this.data = dataUtil.updateData(this.data, data.data, "id");
              this.onEditCancel();
            } else {
              that.$Message.error(data.message);
            }
          });
        } else {
          this.$ajax.post(this.$api.RoleAdd, params, this).then((data) => {
            if (data.success) {
              this.roleData = data.data;
              this.data.push(this.roleData);
              this.onEditCancel();
            } else {
              that.$Message.error(data.message);
            }
          });
        }

      },
      onRootAdd: function () {
        this.roleModel = true;
        this.roleData.id = null;
        this.modelTitle = "新增角色";
      },
      onDoSearch: function () {
        var params = new FormData();
        params.append('code', this.searchCode);
        params.append('name', this.searchName);
        let that = this;
        this.$ajax.post(this.$api.RoleQuery, params, this).then((data) => {
          if (data.success) {
            this.data = data.data;
          } else {
            that.$Message.error(data.message);
          }
        });
      },
      onItemEdit: function (result, event, index) {
        this.roleData = result;
        this.roleData.roleType = this.getRoleTypeValue(result.roleType);
        this.roleModel = true;
        this.modelTitle = "编辑角色";
      },
      onItemDel: function (result, event, index) {
        this.$Modal.confirm({
          title: '删除',
          content: '<p>确认要删除该角色吗？</p>',
          onOk: () => {
            var params = new FormData();
            params.append('roleId', result.id);
            let that = this;
            this.$ajax.post(this.$api.RoleDelete, params, this).then((data) => {
              if (data.success) {
                this.data = dataUtil.deleteData(this.data, result.id, "id");
              } else {
                that.$Message.error(data.message);
              }
            });
          },
          onCancel: () => {
          }
        });
      },
      onGrant: function (result, event, index) {
        this.currentItem = result;
        var params = new FormData();
        params.append('roleId', result.id);
        let that = this;
        this.$ajax.post(this.$api.RoleMenu, params, this).then((data) => {
          if (data.success) {
            let allMenu = data.data.allMenu;
            let roleMenu = data.data.roleMenu;
            this.grantNodes = [];
            allMenu.forEach(function (item, index) {
              that.reloadTreeData(item, "menuName", roleMenu);
            });
            this.treeData = allMenu;
            this.powerModel = true;
          } else {
            that.$Message.error(data.message);
          }
        });
      },
      granTreeChange: function (nodes) {
        this.grantNodes = nodes;
      },
      onRoleGrantNew: function () {
        let that = this
        var ids = [];
        this.grantNodes.forEach(function (item, index) {
          ids.push(item.id);
        })
        var params = new FormData();
        params.append('menuIds', ids);
        params.append('roleId', this.currentItem.id);
        this.$ajax.post(this.$api.RoleGrantMenu, params, this).then((data) => {
          if (data.success) {
            this.powerModel = false;
          } else {
            that.$Message.error(data.message);
          }
        });
      },
      reloadTreeData: function (item, key, roleMenu) {
        let that = this;
        item.title = item[key];
        for (var i = 0; i < roleMenu.length; i++) {
          var menu = roleMenu[i];
          if (menu.id == item.id) {
            item.checked = true;
            this.grantNodes.push(item);
            break;
          }
        }
        if (item.children.length > 0) {
          item.children.forEach(function (item, index) {
            that.reloadTreeData(item, key, roleMenu);
          })
        }
      },
      getRoleTypeValue: function (type) {
        switch (type) {
          case "管理员":
            return "ADMIN";
          case "普通用户":
            return "USER";
        }
      },
      dataFormat: function (item) {
        switch (item.roleType) {
          case "SUPER_ADMIN":
            item.roleType = '超级管理员';
            item.noAction = true;
            break;
          case "ADMIN":
            item.roleType = '管理员';
            break;
          case "USER":
            item.roleType = '普通用户';
            break;
          default:
            break;
        }
        return item;
      },
      loadData: function () {
        this.$ajax.post(this.$api.RoleQueryAll, null, this).then((data) => {
          if (data.success) {
            this.data = data.data;
          }
        });
      },
    },
    mounted() {
      this.$parent.activeMenu("role");
      this.loadData();
    }
  }

</script>
