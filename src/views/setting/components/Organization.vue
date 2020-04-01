<!--机构管理-->
<template>
  <div class="setting-organization-container">
    <div class="search-container">
      <div class="search-button" style="margin-right: 30px">
        <Button @click="onRootAdd" icon="plus-round" type="primary">新增</Button>
      </div>
      <div class="search-button">
        <Button @click="onDoSearch" icon="ios-search" type="primary">查询</Button>
      </div>
      <div class="search-item">
        <div class="search-item-label">
          机构代码:
        </div>
        <div class="search-item-condition">
          <Input v-model="searchCode" style="width:200px" placeholder=""></Input>
        </div>
      </div>
      <div class="search-item">
        <div class="search-item-label">
          机构名称:
        </div>
        <div class="search-item-condition">
          <Input v-model="searchName" style="width:200px" placeholder=""></Input>
        </div>
      </div>
    </div>
    <div class="organ-content-container">
      <div class="organ-tree-container" v-bind:style="{'height':(pageHeight-50)+'px'}">
        <Tree @on-select-change="onNodeSelected" v-bind:style="{'height':(pageHeight-50)+'px'}" :data="data"
              empty-text="请新增根节点"></Tree>
      </div>
      <div class="organ-info-container"
           v-bind:style="{'height':(pageHeight-50)+'px','width':(pageWidth-200)+'px'}">
        <div v-show="selectedItem!=null||isRootAdd" class="info-actions">
          <div @click="onAddChild" v-show="!isRootAdd" class="info-action-btn">
            <i class="fa fa-sitemap" aria-hidden="true"></i>
            <label>添加子机构</label>
          </div>
          <div @click="onFormSubmit" class="info-action-btn">
            <i class="fa fa-floppy-o" aria-hidden="true"></i>
            <label>保存</label>
          </div>
          <div @click="onDelete" v-show="!isRootAdd" class="info-action-btn">
            <i class="fa fa-trash" aria-hidden="true"></i>
            <label>删除</label>
          </div>
        </div>
        <div v-show="selectedItem!=null||isRootAdd" class="organ-info-form">
          <Form ref="organForm" :model="currentItem" :rules="ruleValidate" :label-width="80">
            <FormItem label="机构名称" prop="organName">
              <Input v-model="currentItem.organName" placeholder="请输入机构名称"></Input>
            </FormItem>
            <FormItem label="机构代码" prop="organCode">
              <Input v-model="currentItem.organCode" placeholder="请输入机构代码"></Input>
            </FormItem>
            <FormItem label="所在区域" prop="areaName">
              <Input disabled v-model="currentItem.areaName" placeholder="请选择所在区域">
              <Button @click="onShowAreaTree" slot="append" icon="ios-search"></Button>
              </Input>
            </FormItem>
            <FormItem label="排序号">
              <InputNumber v-bind:style="{'width':(pageWidth-300)+'px'}" v-model="currentItem.sort"
                           :min="1"></InputNumber>
            </FormItem>
          </Form>
        </div>
      </div>
    </div>

    <Modal width="300" v-model="areaTreeModel">
      <p slot="header">
        <span>请选择区域</span>
      </p>
      <div style="min-height: 200px;max-height: 400px;overflow: auto">
        <Tree ref="areatree" :data="areaTree"></Tree>
      </div>
      <div slot="footer">
        <Button @click="areaTreeModel=false;selectArea = null">取消</Button>
        <Button @click="onAreaSelected" type="primary">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>

  export default {
    name: "organization-setting",
    props: {
      pageHeight: Number,
      pageWidth: Number
    },
    data() {
      return {
        data: [],
        currentItem: {
          title: "",
          id: "",
          organCode: "",
          organName: "",
          parentId: "",
          sort: 0,
          areaId: "",
          areaCode: "",
          areaName: "",
          createUserId: "",
          parentName: ""
        },
        selectedItem: null,
        isRootAdd: false,
        isChildren: false,
        areaTreeModel: false,
        searchCode: '',
        searchName: '',
        ruleValidate: {
          organName: [
            {required: true, message: '机构名称不能为空', trigger: 'blur'}
          ],
          organCode: [
            {required: true, message: '机构代码不能为空', trigger: 'blur'}
          ]
        },
        areaTree: [],
        selectArea: null
      }
    },
    methods: {
      onAreaSelected: function () {
        let nodes = this.$refs.areatree.getSelectedNodes();
        if (nodes.length > 1) {
          this.$Message.error('只能选中一个区域');
        } else {
          this.selectArea = nodes[0];
          this.areaTreeModel = false;
          this.currentItem.areaName = nodes[0].areaName;
          this.currentItem.areaCode = nodes[0].areaCode;
          this.currentItem.areaId = nodes[0].id;
        }
      },
      onShowAreaTree: function () {
        this.areaTreeModel = true;
      },
      onAddChild: function () {
        this.isRootAdd = true;
        this.currentItem = {
          title: "",
          id: "",
          organCode: "",
          organName: "",
          parentId: this.selectedItem.id,
          sort: 0,
          areaId: "",
          areaCode: "",
          areaName: "",
          createUserId: "",
          parentName: this.selectedItem.organName
        };
      },
      onDelete: function () {
        if (this.selectedItem != null) {
          this.$Modal.confirm({
            title: '删除',
            content: '<p>确认要删除该机构及所有子机构吗？</p>',
            onOk: () => {
              var params = new FormData();
              params.append('organId', this.selectedItem.id);
              let that = this;
              this.$ajax.post(this.$api.OrganDelete, params, this).then((data) => {
                if (data.success) {
                  data.data.forEach(function (item, index) {
                    that.reloadTreeData(item, "organName");
                  });
                  this.data = data.data;
                  this.selectedItem = null;
                } else {
                  that.$Message.error(data.message);
                }
              });
            },
            onCancel: () => {
            }
          });
        }
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
        this.$ajax.post(this.$api.AreaQueryAll, null, this).then((data) => {
          if (data.success) {
            data.data.forEach(function (item, index) {
              that.reloadTreeData(item, "areaName");
            });
            that.areaTree = data.data;
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
      onNodeSelected: function (item) {
        this.selectedItem = item[0];
        this.currentItem = item[0];
        this.isRootAdd = false;
      },
      onRootAdd: function () {
        this.currentItem = {
          title: "",
          id: "",
          organCode: "",
          organName: "",
          parentId: -1,
          sort: 0,
          areaId: "",
          areaCode: "",
          areaName: "",
          createUserId: "",
          parentName: "根节点"
        };
        this.selectedItem = {
          title: "",
          id: -1,
          organCode: "",
          organName: "",
          parentId: -1,
          sort: 0,
          areaId: "",
          areaCode: "",
          areaName: "",
          createUserId: "",
          parentName: "根节点"
        };
        this.isRootAdd = true;
      },
      onFormSubmit: function () {
        this.$refs.organForm.validate((valid) => {
          if (valid) {
            if (!this.currentItem.areaId) {
              this.$Message.error('请选择一个区域');
              return;
            }
            this.onPostData();
          }
        });
      },
      onPostData: function () {
        if (this.isRootAdd) {
          var params = new FormData();
          params.append('organName', this.currentItem.organName);
          params.append('organCode', this.currentItem.organCode);
          params.append('sort', this.currentItem.sort);
          params.append('areaType', this.currentItem.typeValue);
          params.append('parentId', this.selectedItem.id);
          params.append('areaId', this.currentItem.areaId);
          params.append('areaCode', this.currentItem.areaCode);
          params.append('areaName', this.currentItem.areaName);
          let that = this;
          this.$ajax.post(this.$api.OrganAdd, params, this).then((data) => {
            if (data.success) {
              data.data.forEach(function (item, index) {
                that.reloadTreeData(item, "organName");
              });
              this.data = data.data;
              this.isRootAdd = false;
              this.selectedItem = null;
            } else {
              that.$Message.error(data.message);
            }
          });
        } else {
          var params = new FormData();
          params.append('id', this.currentItem.id);
          params.append('organName', this.currentItem.organName);
          params.append('organCode', this.currentItem.organCode);
          params.append('sort', this.currentItem.sort);
          params.append('areaType', this.currentItem.typeValue);
          params.append('parentId', this.currentItem.parentId);
          params.append('areaId', this.currentItem.areaId);
          params.append('areaCode', this.currentItem.areaCode);
          params.append('areaName', this.currentItem.areaName);
          params.append('createUserId', this.currentItem.createUserId);
          let that = this;
          this.$ajax.post(this.$api.OrganEdit, params, this).then((data) => {
            if (data.success) {
              data.data.forEach(function (item, index) {
                that.reloadTreeData(item, "organName");
              });
              this.data = data.data;
              this.isRootAdd = false;
              this.selectedItem = null;
            } else {
              that.$Message.error(data.message);
            }
          });
        }
      },
      onDoSearch: function () {
        var params = new FormData();
        params.append('code', this.searchCode);
        params.append('name', this.searchName);
        let that = this;
        this.$ajax.post(this.$api.OrganQuery, params, this).then((data) => {
          if (data.success) {
            data.data.forEach(function (item, index) {
              that.reloadTreeData(item, "organName");
            });
            this.data = data.data;
          } else {
            that.$Message.error(data.message);
          }
        });
      }
    },
    mounted() {
      this.$parent.activeMenu("organization");
      this.loadData();
    }
  }

</script>
