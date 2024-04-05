<template>
  <div>
    <el-container>
      <el-header>
        <div
          style="
            display: flex;
            justify-content: space-between;
            line-height: 60px;
            height: 60px;
          "
        >
          <div class="title">单词翻译系统管理平台</div>
          <div class="name">
            <el-dropdown
              v-show="userName"
              trigger="click"
              @command="handleCommand"
            >
              <span>{{ userName }}</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="exit">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <!-- <span v-show="userName">{{ userName }}</span> -->
          </div>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu :router="router" :default-active="activeIndex">
            <el-menu-item index="/mgr">用户列表</el-menu-item>
            <el-menu-item index="/mgr/wordList">单词列表</el-menu-item>
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
      activeIndex: "/mgr",
      userName: "",
      router: true,
    };
  },
  created() {
    var userStr = localStorage.getItem("mgruser");
    if (userStr) {
      var user = JSON.parse(userStr);
      this.userName = user.userName;
    } else {
      this.$router.push({
        path: "/mgrlogin",
      });
    }
  },
  methods: {
    handleCommand(command) {
      if (command == "exit") {
        localStorage.removeItem("mgruser");
        window.location.reload();
      }
    },
    handleChange(value) {
      //console.log(value);
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
.main {
  height: calc(100vh - 60px);
  padding: 10px;
}
</style>
