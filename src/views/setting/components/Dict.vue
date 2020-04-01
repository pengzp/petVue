<!--字典管理-->
<template>
  <div class="setting-dict-container">
    <div class="search-container">
      <div class="search-button" style="margin-right: 30px">
        <Button @click="onRootAdd" icon="plus-round" type="primary">新增</Button>
      </div>
      <div class="search-button">
        <Button @click="loadData" icon="ios-search" type="primary">查询</Button>
      </div>
      <div class="search-item">
        <div class="search-item-label">
          字典代码:
        </div>
        <div class="search-item-condition">
          <Input v-model="searchCode" style="width:200px" placeholder=""></Input>
        </div>
      </div>
      <div class="search-item">
        <div class="search-item-label">
          字典名称:
        </div>
        <div class="search-item-condition">
          <Input v-model="searchName" style="width:200px" placeholder=""></Input>
        </div>
      </div>
    </div>
    <div class="dict-content-container">
      <Table border :columns="dictColumns" :data="dicts"></Table>
    </div>

    <Modal width="600" v-model="dictModel">
      <p slot="header">
        <span>{{modelTitle}}</span>
      </p>
      <div>
        <Form ref="dictForm" :model="dictData" :rules="roleValidate" :label-width="80">
          <FormItem label="字典名称" prop="dictName">
            <Input v-model="dictData.dictName" placeholder="请输入字典名称"></Input>
          </FormItem>
          <FormItem label="字典代码" prop="dictCode">
            <Input :disabled="dictData.id!=null" v-model="dictData.dictCode" placeholder="字典代码代码(英文字母)"></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="dictModel = false">取消</Button>
        <Button @click="onSubmit" type="primary">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import dataUtils from '../../../utils/DataUtil'

  export default {
    name: "dict-setting",
    props: {
      pageHeight: Number,
      pageWidth: Number
    },
    data() {
      return {
        dictModel: false,
        searchCode: '',
        searchName: '',
        dictData: {
          id: null,
          dictName: "",
          dictCode: ""
        },
        roleValidate: {
          dictName: [
            {required: true, message: '名称不能为空', trigger: 'blur'}
          ],
          dictCode: [
            {required: true, message: '代码不能为空', trigger: 'blur'}
          ]
        },
        modelTitle: "新增字典",
        dictColumns: [
          {
            title: '字典名称',
            key: 'dictName'
          },
          {
            title: '字典代码',
            key: 'dictCode'
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
                      this.showItems(params.row)
                    }
                  }
                }, '字典项')
              ]);
            }
          }
        ],
        dicts: []
      }
    },
    methods: {
      onSubmit: function () {
        this.$refs.dictForm.validate((valid) => {
          if (valid) {
            this.onPostData();
          }
        });
      },
      onPostData: function () {
        if (this.dictData.id) {
          var params = new FormData();
          params.append('dictName', this.dictData.dictName);
          params.append('dictCode', this.dictData.dictCode);
          params.append('id', this.dictData.id);
          let that = this;
          this.$ajax.post(this.$api.DictEdit, params, this).then((data) => {
            if (data.success) {
              this.dicts = dataUtils.updateData(this.dicts, data.data, "id");
              this.dictModel = false;
            } else {
              that.$Message.error(data.message);
            }
          });
        } else {
          var params = new FormData();
          params.append('dictName', this.dictData.dictName);
          params.append('dictCode', this.dictData.dictCode);
          let that = this;
          this.$ajax.post(this.$api.DictAdd, params, this).then((data) => {
            if (data.success) {
              this.dicts.push(data.data);
              this.dictModel = false;
            } else {
              that.$Message.error(data.message);
            }
          });
        }
      },
      onRootAdd: function () {
        this.dictModel = true;
        this.modelTitle = "新增字典";
        this.dictData = {
          id: null,
          dictName: "",
          dictCode: ""
        };
      },
      onItemEdit: function (item) {
        this.modelTitle = "编辑字典";
        this.dictData = item;
        this.dictModel = true;
      },
      remove: function (item) {
        this.$Modal.confirm({
          title: '删除',
          content: '<p>确认要删除该字典及所有字典项吗？</p>',
          onOk: () => {
            var params = new FormData();
            params.append('dictId', item.id);
            let that = this;
            this.$ajax.post(this.$api.DictDelete, params, this).then((data) => {
              if (data.success) {
                this.dicts = dataUtils.deleteData(this.dicts, item.id, "id");
              } else {
                that.$Message.error(data.message);
              }
            });
          },
          onCancel: () => {
          }
        });
      },
      showItems: function (item) {
        this.$router.push({path: '/admin/setting/dictitem', query: {id: item.id}})
      },
      loadData: function () {
        var params = new FormData();
        params.append('name', this.searchName);
        params.append('code', this.searchCode);
        let that = this;
        this.$ajax.post(this.$api.DictQuery, params, this).then((data) => {
          if (data.success) {
            this.dicts = data.data;
          } else {
            that.$Message.error(data.message);
          }
        });
      }
    },
    mounted() {
      this.$parent.activeMenu("dict");
      this.loadData();
    }
  }
</script>
