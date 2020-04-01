<!--用户管理-->
<template>
  <div class="setting-user-container">
    <div class="search-container">
      <div v-show="selectedOrgan!=null" class="search-button" style="margin-right: 30px">
        <Button @click="onRootAdd" icon="plus-round" type="primary">新增</Button>
      </div>
      <div class="search-button">
        <Button @click="onDoSearch" icon="ios-search" type="primary">查询</Button>
      </div>
      <div class="search-item">
        <div class="search-item-label">
          显示名:
        </div>
        <div class="search-item-condition">
          <Input v-model="showName" style="width:200px" placeholder=""></Input>
        </div>
      </div>
      <div class="search-item">
        <div class="search-item-label">
          登录名:
        </div>
        <div class="search-item-condition">
          <Input v-model="loginName" style="width:200px" placeholder=""></Input>
        </div>
      </div>
    </div>
    <div class="user-content-container">
      <div class="organ-tree-container" v-bind:style="{'height':(pageHeight-50)+'px'}">
        <Tree @on-select-change="onOrganSelected" v-bind:style="{'height':(pageHeight-50)+'px'}" :data="data"
              empty-text="请先添加机构数据"></Tree>
      </div>
      <div class="user-list-container"
           v-bind:style="{'height':(pageHeight-50)+'px','width':(pageWidth-200)+'px'}">
        <Table border :columns="userColumns" :data="userList"></Table>
      </div>
    </div>

    <Modal width="600" v-model="userModel">
      <p slot="header">
        <span>{{modelTitle}}</span>
      </p>
      <div>
        <Form ref="userForm" :model="currentUser" :rules="ruleValidate" :label-width="80">
          <FormItem label="登录名" prop="username">
            <Input :disabled="currentUser.id!=null" v-model="currentUser.username" placeholder="登录名称"></Input>
          </FormItem>
          <FormItem label="显示名" prop="displayName">
            <Input v-model="currentUser.displayName" placeholder="显示名称"></Input>
          </FormItem>
          <FormItem label="所在机构" prop="organCode">
            <Input disabled v-model="currentUser.organCode" placeholder="用户所在机构"></Input>
          </FormItem>
          <FormItem label="登录密码" prop="password">
            <Input :disabled="currentUser.id!=null" type="password" v-model="currentUser.password"
                   placeholder="用户密码"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="userModel=false">取消</Button>
        <Button @click="onDoSubmit" type="primary">确定</Button>
      </div>
    </Modal>

    <Modal width="450" v-model="roleModel">
      <p slot="header">
        <span>用户角色</span>
      </p>
      <div>
        <Transfer
          :titles="['所有角色','已有角色']"
          :data="allRoles"
          :target-keys="userRoles"
          filterable
          :filter-method="roleFilter"
          :render-format="roleFormat"
          @on-change="roleChange"></Transfer>
      </div>
      <div slot="footer">
        <Button @click="roleModel=false">取消</Button>
        <Button @click="doUpdateRoles" type="primary">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import dataUtil from '../../../utils/DataUtil'

  export default {
    name: "user-setting",
    props: {
      pageHeight: Number,
      pageWidth: Number
    },
    data() {
      return {
        currentUser: {
          id: null,
          username: "",
          password: "",
          organCode: "",
          displayName: "",
          createUserId: ""
        },
        ruleValidate: {
          username: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          displayName: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          organCode: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
        },
        showName: "",
        loginName: "",
        data: [],
        userModel: false,
        modelTitle: '新增用户',
        selectedOrgan: null,
        userColumns: [
          {
            title: '登录名',
            key: 'username',
            render: (h, params) => {
              return h('div', [
                h('Icon', {
                  props: {
                    type: 'person'
                  }
                }),
                h('strong', params.row.username)
              ]);
            }
          },
          {
            title: '显示名',
            key: 'displayName'
          },
          {
            title: '操作',
            key: 'action',
            width: 300,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.onItemEdit(params.row)
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.remove(params.row)
                    }
                  }
                }, '删除'),
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.onGrantRoles(params.row)
                    }
                  }
                }, '角色')
              ]);
            }
          }
        ],
        userList: [],
        allRoles: [],
        userRoles: [],
        roleModel: false
      }
    },
    methods: {
      doUpdateRoles: function () {
        var params = new FormData();
        params.append('userId', this.currentUser.id);
        params.append('roleIds', this.userRoles);
        let that = this;
        this.$ajax.post(this.$api.UserUpdateRoles, params, this).then((data) => {
          if (data.success) {
            this.roleModel = false;
          } else {
            that.$Message.error(data.message);
          }
        });
      },
      roleChange: function (targetKeys, direction, moveKeys) {
        this.userRoles = targetKeys;
      },
      roleFormat: function (data) {
        return data.roleName;
      },
      roleFilter: function (data, query) {
        return data.roleName.indexOf(query) > -1;
      },
      onGrantRoles: function (item) {
        this.currentUser = item;
        var params = new FormData();
        params.append('userId', item.id);
        let that = this;
        this.$ajax.post(this.$api.RolesUser, params, this).then((data) => {
          if (data.success) {
            this.userRoles = [];
            data.data.forEach(function (item, index) {
              that.userRoles.push(item.id);
            });
            this.roleModel = true;
          } else {
            that.$Message.error(data.message);
          }
        });
      },
      onDoSubmit: function () {
        this.$refs.userForm.validate((valid) => {
          if (valid) {
            this.onPostData();
          }
        });
      },
      onPostData: function () {
        if (this.currentUser.id) {
          var params = new FormData();
          params.append('id', this.currentUser.id);
          params.append('displayName', this.currentUser.displayName);
          let that = this;
          this.$ajax.post(this.$api.UserEdit, params, this).then((data) => {
            if (data.success) {
              this.userList = dataUtil.updateData(this.userList, data.data, "id");
              this.userModel = false;
            } else {
              that.$Message.error(data.message);
            }
          });
        } else {
          var params = new FormData();
          params.append('username', this.currentUser.username);
          params.append('password', this.currentUser.password);
          params.append('organCode', this.currentUser.organCode);
          params.append('displayName', this.currentUser.displayName);
          let that = this;
          this.$ajax.post(this.$api.UserAdd, params, this).then((data) => {
            if (data.success) {
              this.userList.push(data.data);
              this.userModel = false;
            } else {
              that.$Message.error(data.message);
            }
          });
        }
      },
      onOrganSelected: function (array) {
        if (array.length == 0) {
          this.selectedOrgan = null;
        } else {
          this.selectedOrgan = array[0];
          var params = new FormData();
          params.append('organCode', this.selectedOrgan.organCode);
          let that = this;
          this.$ajax.post(this.$api.UserQueryOrgan, params, this).then((data) => {
            if (data.success) {
              this.userList = data.data;
            } else {
              that.$Message.error(data.message);
            }
          });
        }
      },
      onRootAdd: function () {
        this.userModel = true;
        this.modelTitle = "新增用户";
        this.$refs.userForm.resetFields();
        this.currentUser.organCode = this.selectedOrgan.organCode;
      },
      onItemEdit(item) {
        this.currentUser = item;
        this.userModel = true;
        this.modelTitle = "编辑用户";
      },
      remove(item) {
        this.$Modal.confirm({
          title: '删除',
          content: '<p>确认要删除该用火狐吗？</p>',
          onOk: () => {
            var params = new FormData();
            params.append('userId', item.id);
            let that = this;
            this.$ajax.post(this.$api.UserDelete, params, this).then((data) => {
              if (data.success) {
                this.userList = dataUtil.deleteData(this.userList, item.id, "id");
              } else {
                that.$Message.error(data.message);
              }
            });
          },
          onCancel: () => {
          }
        });
      },
      onDoSearch: function () {
        var params = new FormData();
        params.append('loginName', this.loginName);
        params.append('userName', this.userName);
        let that = this;
        this.$ajax.post(this.$api.UserQuery, params, this).then((data) => {
          if (data.success) {
            this.userList = data.data;
          } else {
            that.$Message.error(data.message);
          }
        });
      },
      loadData: function () {
        let that = this;
        this.$ajax.post(this.$api.OrganQueryAll, null, this).then((data) => {
          if (data.success) {
            data.data.forEach(function (item, index) {
              that.reloadTreeData(item, "organName");
            });
            that.data = data.data;
          }
        });
        this.$ajax.post(this.$api.RoleQueryAll, null, this).then((data) => {
          if (data.success) {
            data.data.forEach(function (item, index) {
              item.key = item.id;
            });
            that.allRoles = data.data;
          }
        });
      },
      reloadTreeData: function (item, key) {
        let that = this;
        item.title = item[key];
        if (item.children.length > 0) {
          item.children.forEach(function (item, index) {
            that.reloadTreeData(item, key);
          })
        }
      },
    },
    mounted() {
      this.$parent.activeMenu("user");
      this.loadData();
    }
  }
</script>
