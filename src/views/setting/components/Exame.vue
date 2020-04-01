<template>
    <div class="exame-container">
        <div class="search-container">
            <div class="search-button" style="margin-right: 30px">
                <Button @click="onRootAdd" icon="plus-round" type="primary">新增事项</Button>
            </div>
        </div>
         <div class="role-content-container">
            <div class="table-container" v-bind:style="{'height':(pageHeight-50)+'px','width':(pageWidth-35)+'px'}">
               <Table border :columns="exameColumns" :data="exames"></Table>
            </div>

        </div>

         <Modal width="640" v-model="exameModel">
            <p slot="header">
                <span>{{modelTitle}}</span>
            </p>
            <div>
                <Form ref="dictForm" :model="exameData" :label-width="120">
                    <FormItem label="审批事项名称" prop="name">
                        <Input v-model="exameData.name" placeholder="请输入审批事项名称"></Input>
                    </FormItem>
                    <FormItem label="项目状态" >
                        <Select v-model="exameData.projectStatus" style="width:260px">
                            <Option v-for="(item,index) in projectStatus" :value="item.itemValue" :key="index">{{ item.itemLabel }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="参与审批角色">
                        <Select v-model="exameData.roleIds" multiple style="width:260px">
                            <Option v-for="(item,index)  in roles" :value="item.id" :key="index">{{ item.roleName }}</Option>
                        </Select>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button @click="exameModel = false">取消</Button>
                <Button @click="onSubmit" type="primary">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
export default {
    name: "exame",
    props: {
      pageHeight: Number,
      pageWidth: Number
    },
    data(){
        return{
            exameColumns:[
                {
                    title: '审批事项',
                    key: 'name'
                },
                {
                    title: '参与角色',
                    key: 'roleNames'
                },
                {
                    title: '审批事项发生项目状态',
                    key: 'projectStatusLabel'
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
            exames:[],

            exameModel:false,
            modelTitle:"",
            exameData:{
                name:'',
                projectStatus:'',
                roleIds:[]
            },
            roles:[],
            projectStatus:[]
        }
    },
    mounted(){
        this.initData()
        this.initRole()
        this.initProjectStatus()
    },
    methods:{
        initData(){
            this.$ajax.post(this.$api.ExameDefinitionQuery,null,this,true).then((res)=>{
                if(res.success){
                    this.exames = res.data
                }
            })
        },
        initRole(){
            this.$ajax.post(this.$api.RoleQuery, null, this,true).then((data) => {
                if (data.success) {
                    this.roles = data.data;
                } else {
                    this.$Message.error(data.message);
                }
            });
        },
        initProjectStatus(){
            let params = new FormData()
            params.append("dictCode",window.ApplicationConfig.exameDictCode);
            this.$ajax.post(this.$api.DictQueryCode,params,this,true).then((res)=>{
                if(res.success){
                    this.projectStatus = res.data
                }
            })
        },
        onRootAdd(){
            this.exameModel  =true;
            this.exameData={}
            this.modelTitle = "新增审批事项"
        },
        onItemEdit(row){
            this.exameModel  =true;
          
            this.modelTitle = "编辑审批事项"
            this.exameData={
                id:row.id,
                projectStatus:row.projectStatus.toString() ,
                roleIds:JSON.parse(row.roleIds),
                name:row.name
            }
        },
        remove(row){
            let params = new FormData()
            params.append("id",row.id)
            this.$ajax.post(this.$api.ExameDefinitionRemove,params,this,true).then((res)=>{
                if(res.success){
                    this.initData()
                }
            })
        },
        onSubmit(){
            let that = this
            let params = new FormData()
            if(this.exameData.id){
                params.append("id",this.exameData.id)
            }
            params.append("name" , this.exameData.name)
            params.append("projectStatus ", this.exameData.projectStatus)
            this.projectStatus.forEach((item)=>{
                if(item.itemValue == this.exameData.projectStatus){
                    params.append("projectStatusLabel", item.itemLabel)
                }
            })
            params.append("roleIds ",JSON.stringify(this.exameData.roleIds))
           
            let label = []
            this.exameData.roleIds.forEach((item)=>{
                that.roles.forEach((ro)=>{
                    if(item == ro.id){
                        label.push(ro.roleName)
                    }
                })
            })
             params.append("roleNames ",JSON.stringify(label))
           
            
            this.$ajax.post(this.$api.ExameDefinitionAdd,params,this,true).then((res)=>{
                if(res.success){
                    this.exameModel = false
                    this.initData()
                }
            })
        }
    }
}
</script>