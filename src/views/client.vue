<template>
  <div class="main">
    <el-container class="main">
      <el-header>
        <div
          style="
            display: flex;
            justify-content: space-between;
            line-height: 60px;
            height: 60px;
          "
        >
          <div class="title">不背单词</div>
          <div>
            <el-menu
              mode="horizontal"
              :default-active="activeIndex"
              @select="handleChange"
            >
              <el-menu-item class="item" index="0">首页</el-menu-item>
              <el-menu-item class="item" index="1">生词本</el-menu-item>
              <el-menu-item class="item" index="2">记事本</el-menu-item>
              <el-menu-item class="item" index="3">历史记录</el-menu-item>
            </el-menu>
          </div>
          <div class="name">
            <span>{{ userName || "登录" }}</span>
          </div>
        </div>
        <div style="width: 100%; height: 1px; background: #eee"></div>
      </el-header>
      <el-main>
        <div v-show="activeIndexNumber === 0">
          <Home :windowHeight="windowHeight" :windowWidth="windowWidth"></Home>
        </div>
        <div v-show="activeIndexNumber === 1">
          <NewWord :windowHeight="windowHeight" :windowWidth="windowWidth"></NewWord>
        </div>
        <div v-show="activeIndexNumber === 2">
          <Mark :windowHeight="windowHeight" :windowWidth="windowWidth"></Mark>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
// @ is an alias to /src
import Home from "../components/client/Home.vue";
import NewWord from "../components/client/NewWord.vue";
import Mark from "../components/client/Mark.vue";

export default {
  components: {
    Home: Home,
    NewWord: NewWord,
    Mark: Mark
  },
  data() {
    return {
      activeIndexNumber: 0,
      activeIndex: "0",

      userName: "张三",

      windowWidth: document.documentElement.clientWidth,  //实时屏幕宽度
      windowHeight: document.documentElement.clientHeight,   //实时屏幕高度
    };
  },
  created() {
    console.log(this.windowHeight);
    console.log(this.windowWidth);

    var userStr = localStorage.getItem("user");
    if (userStr) {
      var user = JSON.parse(userStr);
      this.userName = user.name;
    } else {
      var user = {
        name: "张三",
      };
      localStorage.setItem("user", JSON.stringify(user));
    }
  },
  methods: {
    handleChange(value) {
      console.log(value);
      this.activeIndexNumber = Number(value);
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
.item {
  width: 120px;
  text-align: center;
}
.main {
  height: 100%;
  width: 100%;
}
</style>
