<template>
  <div>
    <el-container>
      <el-header>
        <div class="title">单词翻译系统管理平台</div>
        <div class="name">
          <span>{{userName || "登录"}}</span>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
          <el-menu
            background-color="#545c64"
            text-color="#fff"
            :router="router"
            active-text-color="#ffd04b"
          >
            <el-menu-item index="/">用户列表</el-menu-item>
            <el-menu-item index="/wordList">单词列表</el-menu-item>
          </el-menu>
        </el-aside>

        <el-main class="main">
          <!-- 不想跳转到新页面，只在当前页面切换着显示，那么就要涉及到路由的嵌套 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
// @ is an alias to /src

export default {
  data() {
    return {
      userName: "",
      router: true,
    };
  },
  methods: {
    handleChange(value) {
      console.log(value);
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 18px;
}
.name {
  font-size: 14px;
  cursor: pointer;
}
.el-aside {
  color: #333;
}
.main{
  height: calc(100vh - 60px);
  padding: 10px;
}
</style>
