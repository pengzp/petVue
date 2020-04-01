<!--管理员入口-->
<template>
  <div class="admin-page">
    <div class="admin-header">
      <div class="header-logo">
        <img src="/static/images/logo-ico.png">
      </div>
      <div class="header-title">
        宠爱后台管理平台
      </div>
      <div @click="logout" class="logout">
        <Tooltip content="注销登录" placement="bottom">
          <Icon type="md-log-out"></Icon>
        </Tooltip>
      </div>
    </div>
   
    <div class="admin-content" v-bind:style="{'width':contentWidth+'px','height':(contentHeight-102)+'px'}">
      <ul>
        <li>
          <div class="router-item">
            <Card>
              <div class="router-image" style="background: #ff9900">
                <i class="iconfont icon-shezhi"></i>
              </div>
              <div @click="showSystemSetting" class="router-footer sz">
                系统设置
              </div>
            </Card>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import LogoutUtil from '../utils/LogoutUtil'
  import TokenUtil from '../utils/TokenUtil'

  export default {
    name: 'admin',
    props: {
      contentHeight: Number,
      contentWidth: Number
    },
    data() {
      return {
        mockUser: "",
      }
    },
    methods: {
      logout() {
        LogoutUtil.logout(this);
      },
      showSystemSetting() {
        this.$router.push({path: '/admin/setting/user'});
      },
      runAsUser() {
        if (this.mockUser == null || this.mockUser == "") {
          this.$Message.error("请输入需要模拟登录的用户名");
        } else {
          var params = new FormData();
          params.append("username", this.mockUser);
          this.$ajax.post(this.$api.mockUserLogin, params, this).then((data) => {
            if (data.success) {
              this.$store.dispatch("updateUser", data.data.user);
              TokenUtil.setToken(data.data.token, data.data.expirated);
              this.$router.push({path: "/blank"});
            } else {
              this.$Message.error(data.message);
            }
          });
        }

      }
    }
  }
</script>
