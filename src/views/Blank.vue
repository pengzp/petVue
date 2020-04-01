<template>
    <div></div>
</template>
<script>
import routerUtil from '../utils/RouterUtil'
export default {
    data(){
        return{

        }
    },
    mounted(){
        let that = this
        if (this.$store.state.User.user.superAdmin) {
            that.$router.push({path: '/admin'});
        } else {
            var router = routerUtil.getDefaultRouter(this.$store.state.User.user.menus);
            if (router == null) {
                that.$router.push({path: '/404', name: 'page404'});
            } else {
            that.$router.push({path: router});
            }
        }
    }
}
</script>

