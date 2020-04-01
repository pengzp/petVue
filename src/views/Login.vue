<template>
  <div class="login-container">
    <header class="login-header">
      <!-- <div class="sys-title">
        用户登录
      </div> -->
    </header>
    <div class="login-form" :style="{'top':top+'px','right':left+'px'}">
      <!-- <div class="login-tips">欢迎进入</div> -->
      <div class="login-title">宠爱后台管理平台</div>
      <div class="login-tips" style="margin-bottom:35px;">统一登录认证入口！</div>
      <div class="form-con" @keydown.enter="handleSubmit">
        <Form ref="loginForm" :model="form" :rules="rules">
          <FormItem prop="userName">
            <Input :disabled="form.loading" v-model="form.userName" icon=" iconfont icon-user" placeholder="请输入用户名">
              
            </Input>
             
          </FormItem>
          <FormItem prop="password">
            <Input :disabled="form.loading" type="password" v-model="form.password" icon="  iconfont icon-lock" placeholder="请输入密码">
               
            </Input>
          </FormItem>
          <FormItem>
            <Button class="login-btn" @click="handleSubmit" :loading="form.loading" long>
              <span v-if="!form.loading">登&nbsp; &nbsp;录</span>
              <span v-else>正在登录</span>
            </Button>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>
<script>
import md5 from 'js-md5'
  import TokenUtil from '../utils/TokenUtil'
  import routerUtil from '../utils/RouterUtil'

  export default {
    props: {
      contentHeight: Number,
      contentWidth: Number
    },
    name: 'login',
    data() {
      return {
        bgIndex: 1,
        form: {
          userName: '',
          password: '',
          loading: false
        },
        rules: {
          userName: [
            {required: true, message: '账号不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ]
        },
        top:0,
        left:0,
      }
    },
    created(){
      if(!window.ApplicationConfig.loginCheck){
        this.$router.push({path: "/system"});
      }
    },
    methods: {
      handleSubmit: function () {
        let that = this;
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            that.doLogin();
          }
        });
      },
      doLogin: function () {
        var params = new FormData();
        params.append('username', this.form.userName);
        params.append('password', md5(this.form.password.concat(this.form.userName)))
        this.form.loading = true;
        let that = this;
        this.$ajax.post(this.$api.Login, params, this, false).then((data) => {
          if (data.success) {
            that.$store.dispatch("updateUser", data.data.user);
            TokenUtil.setToken(data.data.token, data.data.expirated);
            let redirectPage = that.$route.query.redirect;
            if (redirectPage&&redirectPage!='/403'&&redirectPage!='/404') {
              that.$router.push({path: redirectPage});
            } else {
              if (data.data.user.superAdmin) {
                that.$router.push({path: '/admin'});
              } else {
                var router = routerUtil.getDefaultRouter(data.data.user.menus);
                if(router == null){
                  that.$router.push({path: '/404', name:'page404'});
                }else{
                  that.$router.push({path: router});
                }
              }
            }
          } else {
            that.$Message.error(data.message);
          }
          that.form.loading = false;
        });
      }
    },
    mounted() {
      this.left=(this.contentWidth*0.4 -340)/2
      this.top=(this.contentHeight-325)/2
    }
  }
</script>