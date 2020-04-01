<!--字典管理-->
<template>
  <div class="setting-dict-container">
    <div class="search-container">
      <div class="search-button" style="margin-right: 30px">
        <Button @click="onRootAdd" icon="plus-round" type="primary">新增</Button>
      </div>
    </div>
    <div class="dict-content-container">
      <Table border :columns="dictColumns" :data="items"></Table>
    </div>

    <Modal width="600" v-model="dictModel">
      <p slot="header">
        <span>{{modelTitle}}</span>
      </p>
      <div>
        <Form ref="dictItemForm" :model="itemData" :rules="roleValidate" :label-width="80">
          <FormItem label="标签" prop="itemLabel">
            <Input :disabled="itemData.id!=null" v-model="itemData.itemLabel" placeholder=""></Input>
          </FormItem>
          <FormItem label="值" prop="itemValue">
            <Input v-model="itemData.itemValue" placeholder=""></Input>
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
        dictId: null,
        dictModel: false,
        itemData: {
          id: null,
          dictId: "",
          itemLabel: "",
          itemValue: "",
        },
        roleValidate: {
          itemLabel: [
            {required: true, message: '标签不能为空', trigger: 'blur'}
          ],
          itemValue: [
            {required: true, message: '值不能为空', trigger: 'blur'}
          ]
        },
        modelTitle: "新增字典项",
        dictColumns: [
          {
            title: '标签',
            key: 'itemLabel'
          },
          {
            title: '值',
            key: 'itemValue'
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
                }, '删除')
              ]);
            }
          }
        ],
        items: []
      }
    },
    methods: {
      onSubmit: function () {
        this.$refs.dictItemForm.validate((valid) => {
          if (valid) {
            this.onPostData();
          }
        });
      },
      onPostData: function () {
        if (this.itemData.id) {
          var params = new FormData();
          params.append('itemLabel', this.itemData.itemLabel);
          params.append('itemValue', this.itemData.itemValue);
          params.append('dictId', this.itemData.dictId);
          params.append('id', this.itemData.id);
          let that = this;
          this.$ajax.post(this.$api.DictEditItem, params, this).then((data) => {
            if (data.success) {
              this.items = dataUtils.updateData(this.items, data.data, "id");
              this.dictModel = false;
            } else {
              that.$Message.error(data.message);
            }
          });
        } else {
          var params = new FormData();
          params.append('itemLabel', this.itemData.itemLabel);
          params.append('itemValue', this.itemData.itemValue);
          params.append('dictId', this.dictId);
          let that = this;
          this.$ajax.post(this.$api.DictAddItem, params, this).then((data) => {
            if (data.success) {
              this.items.push(data.data);
              this.dictModel = false;
            } else {
              that.$Message.error(data.message);
            }
          });
        }
      },
      onRootAdd: function () {
        this.dictModel = true;
        this.modelTitle = "新增字典项";
        this.itemData = {
          id: null,
          itemLabel: "",
          itemValue: ""
        };
      },
      onItemEdit: function (item) {
        this.modelTitle = "编辑字典项";
        this.itemData = item;
        this.dictModel = true;
      },
      remove: function (item) {
        this.$Modal.confirm({
          title: '删除',
          content: '<p>确认要删除该字典项吗？</p>',
          onOk: () => {
            var params = new FormData();
            params.append('itemId', item.id);
            let that = this;
            this.$ajax.post(this.$api.DictDeleteItem, params, this).then((data) => {
              if (data.success) {
                this.items = dataUtils.deleteData(this.items, item.id, "id");
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

      },
      loadData: function () {
        var params = new FormData();
        params.append('dictId', this.dictId);
        let that = this;
        this.$ajax.post(this.$api.DictItems, params, this).then((data) => {
          if (data.success) {
            this.items = data.data;
          } else {
            that.$Message.error(data.message);
          }
        });
      }
    },
    mounted() {
      this.$parent.activeMenu("dict");
      this.dictId = this.$route.query.id;
      this.loadData();
    }
  }
</script>
