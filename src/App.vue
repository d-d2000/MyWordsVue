<template>
  <div id="app">
    <!-- 不想跳转到新页面，只在当前页面切换着显示，那么就要涉及到路由的嵌套 -->
    <router-view></router-view>
  </div>
</template>
<script>
// @ is an alias to /src

export default {
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100vh;
  background-image: url(./assets/p1.jpg);
  background-size: cover;
}
.el-header{
  background-color: white;
}
.el-main > div {
  background-color: rgba(255,255,255,1);
}
.el-aside{
  background-color: rgba(255,255,255,1);
}
.el-main > div{
  border-radius: 12px;
  overflow: hidden;
}
// .el-header {
//   display: flex;
//   justify-content: space-between;
//   line-height: 60px;
//   height: 60px;
// }
// .el-card__body, .el-main {
//   padding: 0px 20px !important;
// }
.myinput .el-input__inner {
  height: 52px;
}
</style>
